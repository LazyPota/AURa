import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {
  // Simple type definitions
  type HeaderField = (Text, Text);
  
  type HttpResponse = {
    status : Nat;
    headers : [HeaderField];
    body : Blob;
  };
  
  type TransformContext = {
    response : HttpResponse;
    context : Blob;
  };
  
  // Simple function type without complex generics
  type TransformFunction = shared query TransformContext -> async HttpResponse;
  
  type HttpRequest = {
    url : Text;
    method : { #get; #head; #post };
    headers : [HeaderField];
    body : Blob;
    transform : ?TransformFunction;
  };
  
  type HttpResult = { #ok : HttpResponse; #err : Text };
  
  // Management canister reference
  let ic = actor "aaaaa-aa" : actor {
    http_request : shared query (HttpRequest, Nat) -> async HttpResult;
  };
  
  // State
  private stable var logsStable : [Text] = [];
  private var logs : [Text] = logsStable;
  
  // ML parameters
  private stable var buyThresholdStable : Float = 1.01;
  private var BUY_THRESHOLD : Float = buyThresholdStable;
  let WEIGHT_SPREAD : Float = 1.0;
  let BIAS : Float = 0.0;

  // Transform function
  public shared query func transform(ctx : TransformContext) : async HttpResponse {
    {
      status = ctx.response.status;
      headers = [];
      body = ctx.response.body;
    }
  };
  
  // Helper functions
  /// Add a log entry to the logs array
  func addLog(msg : Text) : () {
    logs := Array.append(logs, [msg]);
  };

  // Helper: Motoko idiomatic substring
  func substr(t : Text, start : Nat, len : Nat) : Text {
    let arr = Text.toArray(t);
    Text.fromArray(Array.tabulate<Char>(len, func i = arr[start + i]));
  };

  // Helper: convert Pattern to Text (only supports #text)
  func patternToText(p : {#text : Text}) : Text {
    switch p {
      case (#text t) t;
    }
  };

  // Helper: find index of substring in string (Motoko idiomatic, no var/break)
  func textIndexOf(haystack : Text, needle : {#text : Text}) : ?Nat {
    let n = patternToText(needle);
    let hlen = Text.size(haystack);
    let nlen = Text.size(n);
    if (nlen == 0 or nlen > hlen) return null;
    for (i in Iter.range(0, hlen - nlen)) {
      var match = true;
      for (j in Iter.range(0, nlen - 1)) {
        if (substr(haystack, i + j, 1) != substr(n, j, 1)) {
          match := false;
        }
      };
      if (match) return ?i;
    };
    null
  };

  // Helper: parse float from priceText (supports 123.45 and 123)
  func parsePriceText(priceText : Text) : ?Float {
    addLog("[DEBUG] parsePriceText called with: " # priceText);
    let priceParts = Iter.toArray(Text.split(priceText, toPattern(".")));
    if (Array.size(priceParts) > 0) {
      let intText : Text = priceParts[0];
      let nOpt = Nat.fromText(intText);
      switch (nOpt) {
        case (?n) { return ?Float.fromInt(n); };
        case null { addLog("❌ Failed to parse int for price: " # priceText); return null; };
      }
    } else {
      addLog("❌ Malformed price: " # priceText);
      return null;
    }
  };

  // Helper: convert Text to Pattern
  func toPattern(t : Text) : {#text : Text} {
    #text t
  };

  /// Parse ETH and BNB price from CoinGecko JSON response
  func parseETHBNBPrices(json : Text) : (?Float, ?Float) {
    let ethKey = "\"ethereum\":{\"usd\":";
    let bnbKey = "\"binancecoin\":{\"usd\":";
    let ethPrice =
      if (Text.contains(json, toPattern(ethKey))) {
        let parts = Iter.toArray(Text.split(json, toPattern(ethKey)));
        if (Array.size(parts) > 1) {
          let after = parts[1];
          switch (textIndexOf(after, #text "}")) {
            case (?i) {
              let raw = substr(after, 0, i);
              let priceText = Text.trim(raw, #text " ");
              let priceOpt = parsePriceText(priceText);
              if (priceOpt == null) { addLog("❌ Failed to parse price for ETH: " # priceText); };
              priceOpt
            };
            case null { null };
          }
        } else null
      } else null;
    let bnbPrice =
      if (Text.contains(json, toPattern(bnbKey))) {
        let parts = Iter.toArray(Text.split(json, toPattern(bnbKey)));
        if (Array.size(parts) > 1) {
          let after = parts[1];
          switch (textIndexOf(after, #text "}")) {
            case (?i) {
              let raw = substr(after, 0, i);
              let priceTextBNB = Text.trim(raw, #text " ");
              let priceOpt = parsePriceText(priceTextBNB);
              if (priceOpt == null) { addLog("❌ Failed to parse price for BNB: " # priceTextBNB); };
              priceOpt
            };
            case null { null };
          }
        } else null
      } else null;
    (ethPrice, bnbPrice)
  };

  /// AI model: decide arbitrage opportunity
  func ai_decision(eth : Float, bnb : Float) : (Text, Float, Text) {
    let spread = (eth / bnb) - 1.0;
    let score = (spread * WEIGHT_SPREAD) + BIAS;
    let decision = if (score > BUY_THRESHOLD) {
      "ARBITRAGE"
    } else {
      "HOLD"
    };
    let reason = "Spread: " # Float.toText(spread) # ", Threshold: " # Float.toText(BUY_THRESHOLD);
    (decision, score, reason)
  };

  /// Main public function: fetch prices, run AI, log all steps
  public func checkMarkets() : async () {
    addLog("✅ Checking ETH/BNB market...");
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin&vs_currencies=usd";
    let request : HttpRequest = {
      url = url;
      method = #get;
      headers = [];
      body = Blob.fromArray([]);
      transform = ?transform;
    };
    let response = await ic.http_request(request, 25_000_000_000);
    switch (response) {
      case (#ok(res)) {
        switch (Text.decodeUtf8(res.body)) {
          case (null) { addLog("❌ Cannot decode response"); };
          case (?jsonText) {
            let (ethOpt, bnbOpt) = parseETHBNBPrices(jsonText);
            switch (ethOpt, bnbOpt) {
              case (?eth, ?bnb) {
                addLog("📈 ETH/USD: $" # Float.toText(eth) # ", BNB/USD: $" # Float.toText(bnb));
                let (decision, score, reason) = ai_decision(eth, bnb);
                addLog("🤖 AI Decision: " # decision # " (score: " # Float.toText(score) # ")");
                addLog("📝 Reason: " # reason);
                if (decision == "ARBITRAGE") {
                  addLog("🚀 ACTION: Arbitrage opportunity detected!");
                } else {
                  addLog("⏸️ ACTION: Hold, no arbitrage.");
                }
              };
              case _ { addLog("❌ Cannot parse ETH/BNB prices"); };
            }
          }
        }
      };
      case (#err(msg)) { addLog("❌ HTTP error: " # msg); };
    }
  };

  /// Governance: update threshold (must be > 0.001)
  public func updateThreshold(newThreshold : Float) : async () {
    if (newThreshold <= 0.001) {
      addLog("❌ Governance: Threshold too low, must be > 0.001");
      return;
    };
    BUY_THRESHOLD := newThreshold;
    addLog("⚙️ Governance: BUY_THRESHOLD updated to " # Float.toText(newThreshold));
  };
  
  /// Get all logs (for frontend)
  public query func getLogs() : async [Text] {
    logs
  };
  
  /// Clear all logs
  public func clearLogs() : async () {
    logs := [];
  };
  
  // System upgrade functions
  system func preupgrade() {
    logsStable := logs;
  };
  
  system func postupgrade() {
    logs := logsStable;
  };
};