import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, ANON_KEY);

export async function sendCommandToDevice(device_id: string, command_name: string, payload = {}) {
  const { data, error } = await supabase.from("commands").insert([{
    device_id,
    command_name,
    payload,
    status: 'pending'
  }]);
  if (error) throw error;
  return data;
}
