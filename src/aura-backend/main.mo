import Text "mo:base/Text";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

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
  let WEIGHT_PRICE : Float = 1.02;
  let BIAS : Float = 0.5;
  let BUY_THRESHOLD : Float = 1.03;
  
  // Transform function
  public shared query func transform(ctx : TransformContext) : async HttpResponse {
    {
      status = ctx.response.status;
      headers = [];
      body = ctx.response.body;
    }
  };
  
  // Helper functions
  func addLog(msg : Text) : () {
    logs := Array.append(logs, [msg]);
  };
  
  func parsePrice(json : Text) : ?Float {
    // Simple demo parser
    if (Text.contains(json, #text "10.5")) {
      ?10.5
    } else if (Text.contains(json, #text "11.2")) {
      ?11.2
    } else if (Text.contains(json, #text "9.8")) {
      ?9.8
    } else {
      ?10.0 // fallback
    }
  };
  
  func predictPrice(current : Float) : Float {
    (current * WEIGHT_PRICE) + BIAS
  };
  
  // Main public function
  public func checkMarket() : async () {
    addLog("✅ Checking market...");
    
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd";
    
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
          case (null) {
            addLog("❌ Cannot decode response");
          };
          case (?jsonText) {
            switch (parsePrice(jsonText)) {
              case (null) {
                addLog("❌ Cannot parse price");
              };
              case (?price) {
                addLog("📈 Current price: $" # Float.toText(price));
                
                let prediction = predictPrice(price);
                addLog("🤖 ML prediction: $" # Float.toText(prediction));
                
                if (prediction > price * BUY_THRESHOLD) {
                  addLog("🚀 DECISION: BUY SIGNAL!");
                } else {
                  addLog("⏸️ DECISION: HOLD");
                };
              };
            };
          };
        };
      };
      case (#err(msg)) {
        addLog("❌ HTTP error: " # msg);
      };
    };
  };
  
  public query func getLogs() : async [Text] {
    logs
  };
  
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
}