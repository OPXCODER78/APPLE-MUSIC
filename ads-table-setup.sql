-- Create ads table
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    button_text TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ads_updated_at 
    BEFORE UPDATE ON public.ads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies for ads table
-- Allow public read access to active ads
CREATE POLICY "Allow public read access to active ads" ON public.ads
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all ads (for admin)
CREATE POLICY "Allow authenticated users to read all ads" ON public.ads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert ads
CREATE POLICY "Allow authenticated users to insert ads" ON public.ads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update ads
CREATE POLICY "Allow authenticated users to update ads" ON public.ads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete ads
CREATE POLICY "Allow authenticated users to delete ads" ON public.ads
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample ads data
INSERT INTO public.ads (title, description, image_url, link_url, button_text, is_active, display_order) VALUES
('Welcome to Our Platform', 'Discover amazing content and features designed just for you.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://example.com/welcome', 'Get Started', true, 1),
('Premium Features', 'Unlock exclusive content and advanced features with our premium subscription.', 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80', 'https://example.com/premium', 'Upgrade Now', true, 2),
('New Release', 'Check out our latest content and stay up to date with the newest releases.', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', 'https://example.com/new', 'Explore Now', true, 3);

-- Grant necessary permissions
GRANT ALL ON public.ads TO authenticated;
GRANT SELECT ON public.ads TO anon;