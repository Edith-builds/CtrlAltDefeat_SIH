-- Create sensor_readings table
CREATE TABLE public.sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL DEFAULT 'SENSOR-001',
    water_level DECIMAL(6,3) NOT NULL,
    temperature DECIMAL(4,1) NOT NULL,
    tds INTEGER NOT NULL,
    lat DECIMAL(9,6) NOT NULL,
    lng DECIMAL(9,6) NOT NULL,
    battery_pct INTEGER DEFAULT 100,
    signal_rssi INTEGER DEFAULT -70,
    flood_status VARCHAR(20) NOT NULL DEFAULT 'normal',
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
    id SERIAL PRIMARY KEY,
    flood_height DECIMAL(6,3) NOT NULL DEFAULT 220.0,
    update_interval INTEGER NOT NULL DEFAULT 3000,
    calibration_offset DECIMAL(6,3) NOT NULL DEFAULT 0.0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commands table
CREATE TABLE public.commands (
    id BIGSERIAL PRIMARY KEY,
    command_name VARCHAR(100) NOT NULL,
    payload JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_sensor_readings_device_time ON public.sensor_readings(device_id, recorded_at DESC);
CREATE INDEX idx_sensor_readings_recorded_at ON public.sensor_readings(recorded_at DESC);
CREATE INDEX idx_commands_status ON public.commands(status);

-- Enable Row Level Security
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;

-- Create public read policies (sensor data is public for dashboard viewing)
CREATE POLICY "Anyone can view sensor readings" 
ON public.sensor_readings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert sensor readings" 
ON public.sensor_readings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view settings" 
ON public.settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update settings" 
ON public.settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view commands" 
ON public.commands 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert commands" 
ON public.commands 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update commands" 
ON public.commands 
FOR UPDATE 
USING (true);

-- Insert default settings
INSERT INTO public.settings (flood_height, update_interval, calibration_offset)
VALUES (220.0, 3000, 0.0);