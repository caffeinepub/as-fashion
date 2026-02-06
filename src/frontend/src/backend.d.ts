import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface CartItem {
    product_id: bigint;
    size: Size;
    quantity: bigint;
}
export interface CatalogProduct {
    id: bigint;
    imageUrls: Array<string>;
    name: string;
    color: string;
    description: string;
    availableSizes: Array<Size>;
    category: string;
    price: bigint;
}
export interface Order {
    status: OrderStatus;
    createdAt: Time;
    user_id: Principal;
    shippingAddress: string;
    items: Array<CartItem>;
    totalPrice: bigint;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered"
}
export enum Size {
    l = "l",
    m = "m",
    s = "s",
    xl = "xl",
    xs = "xs",
    xxl = "xxl",
    xxxl = "xxxl",
    unsized = "unsized"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(cart: Array<CartItem>, shippingAddress: string): Promise<bigint>;
    createCatalogProduct(name: string, description: string, price: bigint, category: string, imageUrls: Array<string>, availableSizes: Array<Size>, color: string): Promise<bigint>;
    fetchCatalogProduct(id: bigint): Promise<CatalogProduct>;
    fetchCatalogProductsByCategory(category: string): Promise<Array<CatalogProduct>>;
    getCallerUserRole(): Promise<UserRole>;
    getTopCatalogProducts(limit: bigint): Promise<Array<CatalogProduct>>;
    getTrendingCatalogProducts(limit: bigint): Promise<Array<CatalogProduct>>;
    getUserOrders(): Promise<Array<Order>>;
    isCallerAdmin(): Promise<boolean>;
}
