import { Neo4jClient } from '@/lib/neo4j';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = Neo4jClient.session();
    
    const query = `
      // Get brands with products
      MATCH (b:Brand)<-[:MADE_BY]-(p:Product)
      WITH collect(DISTINCT b.name) as brands
      
      // Get materials with products
      MATCH (m:Material)<-[:HAS_MATERIAL]-(p:Product)
      WITH brands, collect(DISTINCT m.name) as materials
      
      // Get colors with products
      MATCH (c:Color)<-[:HAS_COLOR]-(p:Product)
      WITH brands, materials, collect(DISTINCT c.name) as colors
      
      // Get styles with products
      MATCH (s:Style)<-[:HAS_STYLE]-(p:Product)
      WITH brands, materials, colors, collect(DISTINCT s.name) as styles
      
      // Get price range
      MATCH (p:Product)
      WITH brands, materials, colors, styles,
           min(toFloat(p.price)) as minPrice,
           max(toFloat(p.price)) as maxPrice
      
      RETURN {
        brands: brands,
        materials: materials,
        colors: colors,
        styles: styles,
        priceRange: {
          min: minPrice,
          max: maxPrice
        }
      } as filters
    `;

    const result = await session.run(query);
    await session.close();

    const filters = result.records[0].get('filters');
    res.status(200).json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ message: 'Error fetching filters' });
  }
}