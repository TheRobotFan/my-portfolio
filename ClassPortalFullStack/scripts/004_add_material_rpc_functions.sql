-- RPC functions for incrementing material stats

CREATE OR REPLACE FUNCTION increment_material_downloads(material_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE materials
  SET downloads = downloads + 1
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_material_views(material_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE materials
  SET views = views + 1
  WHERE id = material_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
