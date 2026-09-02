export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string | number; // Handles amounts like '2L', '12 pack', or simple counts like 3
  purchased: boolean;
  createdAt: string;
}
