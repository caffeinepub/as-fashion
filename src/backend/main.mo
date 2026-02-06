import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply migration in with clause
(with migration = Migration.run)
actor {
  // CATALOG DEFINITIONS
  public type Size = {
    #xs;
    #s;
    #m;
    #l;
    #xl;
    #xxl;
    #xxxl;
    #unsized;
  };

  public type CatalogProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    availableSizes : [Size];
    color : Text;
    imageUrls : [Text];
  };

  public type CartItem = {
    product_id : Nat;
    size : Size;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    user_id : Principal;
    items : [CartItem];
    shippingAddress : Text;
    totalPrice : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  public type CatalogSearchFilter = {
    priceRange : ?(Nat, Nat);
    size : ?Size;
    color : ?Text;
  };

  let products = Map.empty<Nat, CatalogProduct>();
  let orders = Map.empty<Nat, Order>();

  var nextProductId = 1;
  var nextOrderId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product Comparison Module
  module CatalogProduct {
    public func compareByPriceAsc(p1 : CatalogProduct, p2 : CatalogProduct) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };

    public func compareByPriceDesc(p1 : CatalogProduct, p2 : CatalogProduct) : Order.Order {
      Nat.compare(p2.price, p1.price);
    };
  };

  public query ({ caller }) func fetchCatalogProductsByCategory(category : Text) : async [CatalogProduct] {
    products.values().toArray().filter(
      func(p) { p.category == category },
    );
  };

  public query ({ caller }) func fetchCatalogProduct(id : Nat) : async CatalogProduct {
    products.get(id).unwrap();
  };

  public shared ({ caller }) func checkout(cart : [CartItem], shippingAddress : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart cannot be empty!");
    };

    let user = caller;

    let totalPrice = cart.foldLeft(
      0,
      func(acc, item) {
        switch (products.get(item.product_id)) {
          case (null) { acc };
          case (?product) { acc + (product.price * item.quantity) };
        };
      },
    );

    let order : Order = {
      user_id = user;
      items = cart;
      shippingAddress;
      totalPrice;
      status = #pending;
      createdAt = Time.now();
    };

    let orderId = nextOrderId;
    orders.add(orderId, order);
    nextOrderId += 1;

    orderId;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    orders.values().toArray().filter(
      func(o) { o.user_id == caller }
    );
  };

  public query ({ caller }) func getTopCatalogProducts(limit : Nat) : async [CatalogProduct] {
    let allProducts = products.values().toArray();
    let sortedProducts = allProducts.sort(CatalogProduct.compareByPriceAsc);
    let takeLimit = Nat.min(limit, sortedProducts.size());
    sortedProducts.sliceToArray(0, takeLimit);
  };

  let productSeedData = [
    {
      id = 1;
      name = "Men's White T-Shirt";
      description = "Comfortable cotton t-shirt, available in various sizes.";
      category = "men";
      price = 1500;
      availableSizes = [#s, #m, #l, #xl, #xxl, #xxxl];
      color = "white";
      imageUrls = [
        "/assets/generated/mens_white_tshirt_1.jpg",
        "/assets/generated/mens_white_tshirt_2.jpg",
      ];
    },
    {
      id = 2;
      name = "Women's Kurta";
      description = "Elegant floral print kurta in comfortable fabric.";
      category = "women";
      price = 2300;
      availableSizes = [#xs, #s, #m, #l, #xl, #xxl];
      color = "pink";
      imageUrls = [
        "/assets/generated/womens_kurta_pink_1.jpg",
        "/assets/generated/womens_kurta_pink_2.jpg",
      ];
    },
    {
      id = 3;
      name = "Women's Saree";
      description = "Traditional silk saree in vibrant colors.";
      category = "women";
      price = 4500;
      availableSizes = [#unsized];
      color = "blue, gold";
      imageUrls = [
        "/assets/generated/womens_silk_saree_1.jpg",
        "/assets/generated/womens_silk_saree_2.jpg",
      ];
    },
    {
      id = 4;
      name = "Baby Onesie Set";
      description = "Soft cotton onesies for babies, assorted pack of 3.";
      category = "baby";
      price = 1200;
      availableSizes = [#xs, #s];
      color = "mixed";
      imageUrls = [
        "/assets/generated/baby_onesie_set_1.jpg",
        "/assets/generated/baby_onesie_set_2.jpg",
      ];
    },
    {
      id = 5;
      name = "Men's Jeans";
      description = "Stylish and durable denim jeans for men.";
      category = "men";
      price = 2700;
      availableSizes = [#s, #m, #l, #xl, #xxl];
      color = "blue";
      imageUrls = [
        "/assets/generated/mens_jeans_blue_1.jpg",
        "/assets/generated/mens_jeans_blue_2.jpg",
      ];
    },
    {
      id = 6;
      name = "Men's Formal Shirt";
      description = "Classic fit formal shirt for business and casual occasions.";
      category = "men";
      price = 2000;
      availableSizes = [#s, #m, #l, #xl, #xxl, #xxxl];
      color = "white";
      imageUrls = [
        "/assets/generated/mens_formal_shirt_white_1.jpg",
        "/assets/generated/mens_formal_shirt_white_2.jpg",
      ];
    },
    {
      id = 7;
      name = "Women's Silk Saree";
      description = "Luxurious pure silk saree with traditional motifs.";
      category = "women";
      price = 6000;
      availableSizes = [#unsized];
      color = "red";
      imageUrls = [
        "/assets/generated/womens_silk_saree_red_1.jpg",
        "/assets/generated/womens_silk_saree_red_2.jpg",
      ];
    },
    {
      id = 8;
      name = "Men's Cotton T-Shirt";
      description = "Casual cotton t-shirt, perfect for everyday wear.";
      category = "men";
      price = 1200;
      availableSizes = [#s, #m, #l, #xl, #xxl, #xxxl];
      color = "blue";
      imageUrls = [
        "/assets/generated/mens_cotton_tshirt_blue_1.jpg",
        "/assets/generated/mens_cotton_tshirt_blue_2.jpg",
      ];
    },
  ];

  for (product in productSeedData.values()) {
    products.add(product.id, product);
  };

  public query ({ caller }) func getTrendingCatalogProducts(limit : Nat) : async [CatalogProduct] {
    let allProducts = products.values().toArray();
    let sortedProducts = allProducts.sort(CatalogProduct.compareByPriceAsc);
    let takeLimit = Nat.min(limit, sortedProducts.size());
    sortedProducts.sliceToArray(0, takeLimit);
  };

  public shared ({ caller }) func createCatalogProduct(
    name : Text,
    description : Text,
    price : Nat,
    category : Text,
    imageUrls : [Text],
    availableSizes : [Size],
    color : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let productId = nextProductId;
    let newProduct : CatalogProduct = {
      id = productId;
      name;
      description;
      price;
      category;
      imageUrls;
      availableSizes;
      color;
    };

    products.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };
};
