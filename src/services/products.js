import { supabase } from "../lib/supabaseClient";

export async function fetchProducts() {
  console.log("fetchProducts: start");

  const { data, error } = await supabase
    .from("products")
    .select("id,name,category,price,description,image_url,created_at")
    .order("created_at", { ascending: false });

  console.log("fetchProducts: result", { data, error });

  if (error) throw error;
  return data ?? [];
}


