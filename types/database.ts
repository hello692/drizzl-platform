export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          category: string;
          price_cents: number;
          wholesale_price_cents: number | null;
          hero_image_url: string | null;
          is_active: boolean;
          stock_quantity: number;
          product_type: string;
          sku: string | null;
          barcode: string | null;
          price_b2b_tier1_cents: number | null;
          price_b2b_tier2_cents: number | null;
          price_b2b_tier3_cents: number | null;
          cost_cents: number | null;
          is_subscription_eligible: boolean;
          low_stock_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['products']['Row']>;
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
      customers: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          loyalty_points: number;
          loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          is_active: boolean;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['customers']['Row']>;
        Update: Partial<Database['public']['Tables']['customers']['Row']>;
      };
      customer_addresses: {
        Row: {
          id: string;
          customer_id: string;
          label: string;
          address_type: 'home' | 'work' | 'other';
          street_address: string;
          apartment: string | null;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['customer_addresses']['Row']>;
        Update: Partial<Database['public']['Tables']['customer_addresses']['Row']>;
      };
      customer_payment_methods: {
        Row: {
          id: string;
          customer_id: string;
          card_type: string;
          last_four: string;
          expiry_month: number;
          expiry_year: number;
          cardholder_name: string;
          is_default: boolean;
          stripe_payment_method_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['customer_payment_methods']['Row']>;
        Update: Partial<Database['public']['Tables']['customer_payment_methods']['Row']>;
      };
      partners: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          business_name: string;
          contact_name: string;
          phone: string;
          business_type: string;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          credit_limit: number;
          outstanding_balance: number;
          payment_terms: string;
          tax_id: string | null;
          is_active: boolean;
          is_verified: boolean;
          account_manager: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['partners']['Row']>;
        Update: Partial<Database['public']['Tables']['partners']['Row']>;
      };
      partner_addresses: {
        Row: {
          id: string;
          partner_id: string;
          label: string;
          address_type: 'shipping' | 'billing';
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['partner_addresses']['Row']>;
        Update: Partial<Database['public']['Tables']['partner_addresses']['Row']>;
      };
      d2c_orders: {
        Row: {
          id: string;
          customer_id: string;
          order_number: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          tax: number;
          shipping: number;
          discount: number;
          total: number;
          shipping_address_id: string | null;
          payment_method_id: string | null;
          tracking_number: string | null;
          carrier: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['d2c_orders']['Row']>;
        Update: Partial<Database['public']['Tables']['d2c_orders']['Row']>;
      };
      d2c_order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['d2c_order_items']['Row']>;
        Update: Partial<Database['public']['Tables']['d2c_order_items']['Row']>;
      };
      subscriptions: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          status: 'active' | 'paused' | 'cancelled';
          frequency: 'weekly' | 'biweekly' | 'monthly';
          quantity: number;
          unit_price: number;
          next_delivery_date: string;
          shipping_address_id: string | null;
          payment_method_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['subscriptions']['Row']>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Row']>;
      };
      b2b_orders: {
        Row: {
          id: string;
          partner_id: string;
          order_number: string;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          tax: number;
          shipping: number;
          discount: number;
          total: number;
          shipping_address_id: string | null;
          po_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['b2b_orders']['Row']>;
        Update: Partial<Database['public']['Tables']['b2b_orders']['Row']>;
      };
      b2b_order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['b2b_order_items']['Row']>;
        Update: Partial<Database['public']['Tables']['b2b_order_items']['Row']>;
      };
      invoices: {
        Row: {
          id: string;
          partner_id: string;
          order_id: string | null;
          invoice_number: string;
          status: 'pending' | 'paid' | 'overdue' | 'cancelled';
          subtotal: number;
          tax: number;
          total: number;
          due_date: string;
          paid_date: string | null;
          payment_method: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['invoices']['Row']>;
        Update: Partial<Database['public']['Tables']['invoices']['Row']>;
      };
      loyalty_transactions: {
        Row: {
          id: string;
          customer_id: string;
          points: number;
          transaction_type: 'earned' | 'redeemed' | 'expired' | 'bonus';
          description: string;
          reference_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['loyalty_transactions']['Row']>;
        Update: Partial<Database['public']['Tables']['loyalty_transactions']['Row']>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          role: 'super_admin' | 'factory_manager' | 'finance' | 'marketing' | 'support' | 'warehouse' | 'b2b_sales';
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['admin_users']['Row']>;
        Update: Partial<Database['public']['Tables']['admin_users']['Row']>;
      };
      password_reset_tokens: {
        Row: {
          id: string;
          email: string;
          token: string;
          user_type: 'customer' | 'partner' | 'admin' | 'sales';
          expires_at: string;
          used_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['password_reset_tokens']['Row']>;
        Update: Partial<Database['public']['Tables']['password_reset_tokens']['Row']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerAddress = Database['public']['Tables']['customer_addresses']['Row'];
export type CustomerPaymentMethod = Database['public']['Tables']['customer_payment_methods']['Row'];
export type Partner = Database['public']['Tables']['partners']['Row'];
export type PartnerAddress = Database['public']['Tables']['partner_addresses']['Row'];
export type D2COrder = Database['public']['Tables']['d2c_orders']['Row'];
export type D2COrderItem = Database['public']['Tables']['d2c_order_items']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type B2BOrder = Database['public']['Tables']['b2b_orders']['Row'];
export type B2BOrderItem = Database['public']['Tables']['b2b_order_items']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type LoyaltyTransaction = Database['public']['Tables']['loyalty_transactions']['Row'];
export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
