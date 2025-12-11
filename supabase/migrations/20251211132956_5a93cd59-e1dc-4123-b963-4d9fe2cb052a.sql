-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create deployment_locations table for sensor deployment information
CREATE TABLE public.deployment_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id VARCHAR NOT NULL,
  river_name TEXT NOT NULL,
  station_name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deployment_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view deployment locations" 
ON public.deployment_locations 
FOR SELECT 
USING (true);

-- Create policies for insert access
CREATE POLICY "Anyone can insert deployment locations" 
ON public.deployment_locations 
FOR INSERT 
WITH CHECK (true);

-- Create policies for update access
CREATE POLICY "Anyone can update deployment locations" 
ON public.deployment_locations 
FOR UPDATE 
USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_deployment_locations_updated_at
BEFORE UPDATE ON public.deployment_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint on device_id
CREATE UNIQUE INDEX idx_deployment_locations_device_id ON public.deployment_locations(device_id);