import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";



actor {
  type Bill = {
    number : Nat;
    customerName : Text;
    powderCost : Float;
    gasCost : Float;
    labourCost : Float;
    subtotal : Float;
    taxAmount : Float;
    finalTotal : Float;
    timestamp : Time.Time;
  };

  var nextBillNumber = 1;
  let bills = Map.empty<Nat, Bill>();

  public shared ({ caller }) func saveBill(
    customerName : Text,
    powderCost : Float,
    gasCost : Float,
    labourCost : Float,
    taxRate : Float,
  ) : async Nat {
    let subtotal = powderCost + gasCost + labourCost;
    let taxAmount = subtotal * taxRate;
    let finalTotal = subtotal + taxAmount;

    let bill : Bill = {
      number = nextBillNumber;
      customerName;
      powderCost;
      gasCost;
      labourCost;
      subtotal;
      taxAmount;
      finalTotal;
      timestamp = Time.now();
    };

    bills.add(nextBillNumber, bill);
    nextBillNumber += 1;
    bill.number;
  };

  public query ({ caller }) func getAllBills() : async [Bill] {
    bills.values().toArray();
  };

  public query ({ caller }) func getTotalBillCount() : async Nat {
    bills.size();
  };

  public query ({ caller }) func getTotalSalesAmount() : async Float {
    var total = 0.0;
    for (bill in bills.values()) {
      total += bill.finalTotal;
    };
    total;
  };
};
