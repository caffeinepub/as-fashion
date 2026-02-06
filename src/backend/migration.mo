import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldSize = {
    #xs;
    #s;
    #m;
    #l;
    #xl;
    #unsized;
  };

  type OldCatalogProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    availableSizes : [OldSize];
    color : Text;
    imageUrls : [Text];
  };

  type OldCartItem = {
    product_id : Nat;
    size : OldSize;
    quantity : Nat;
  };

  type OldOrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  type OldOrder = {
    user_id : Principal.Principal;
    items : [OldCartItem];
    shippingAddress : Text;
    totalPrice : Nat;
    status : OldOrderStatus;
    createdAt : Time.Time;
  };

  type OldActor = {
    products : Map.Map<Nat, OldCatalogProduct>;
    orders : Map.Map<Nat, OldOrder>;
  };

  type NewSize = {
    #xs;
    #s;
    #m;
    #l;
    #xl;
    #xxl;
    #xxxl;
    #unsized;
  };

  type NewCatalogProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    availableSizes : [NewSize];
    color : Text;
    imageUrls : [Text];
  };

  type NewCartItem = {
    product_id : Nat;
    size : NewSize;
    quantity : Nat;
  };

  type NewOrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  type NewOrder = {
    user_id : Principal.Principal;
    items : [NewCartItem];
    shippingAddress : Text;
    totalPrice : Nat;
    status : NewOrderStatus;
    createdAt : Time.Time;
  };

  type NewActor = {
    products : Map.Map<Nat, NewCatalogProduct>;
    orders : Map.Map<Nat, NewOrder>;
  };

  func convertOldSizeToNew(oldSize : OldSize) : NewSize {
    switch (oldSize) {
      case (#xs) { #xs };
      case (#s) { #s };
      case (#m) { #m };
      case (#l) { #l };
      case (#xl) { #xl };
      case (#unsized) { #unsized };
    };
  };

  func convertOldCartItemToNew(oldCartItem : OldCartItem) : NewCartItem {
    {
      product_id = oldCartItem.product_id;
      size = convertOldSizeToNew(oldCartItem.size);
      quantity = oldCartItem.quantity;
    };
  };

  func convertOldOrderToNew(oldOrder : OldOrder) : NewOrder {
    {
      user_id = oldOrder.user_id;
      items = oldOrder.items.map(func(item) { convertOldCartItemToNew(item) });
      shippingAddress = oldOrder.shippingAddress;
      totalPrice = oldOrder.totalPrice;
      status = oldOrder.status; // No change needed as the type is unchanged
      createdAt = oldOrder.createdAt;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldCatalogProduct, NewCatalogProduct>(
      func(_id, oldProduct) {
        {
          id = oldProduct.id;
          name = oldProduct.name;
          description = oldProduct.description;
          category = oldProduct.category;
          price = oldProduct.price;
          availableSizes = oldProduct.availableSizes.map(
            func(oldSize) {
              convertOldSizeToNew(oldSize);
            }
          );
          color = oldProduct.color;
          imageUrls = oldProduct.imageUrls;
        };
      }
    );

    let newOrders = old.orders.map<Nat, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        convertOldOrderToNew(oldOrder);
      }
    );

    {
      products = newProducts;
      orders = newOrders;
    };
  };
};
