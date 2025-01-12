import { Neo4jClient } from '@/lib/neo4j';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { categories, relationships, limit, filters } = req.body;
    const nodeLimit = parseInt(limit, 10);

    // Build dynamic WHERE clauses based on filters
    const priceFilter = filters.priceRange ? 
      `AND toFloat(p.price) >= ${filters.priceRange[0]} 
       AND toFloat(p.price) <= ${filters.priceRange[1]}` : '';

    const brandFilter = filters.brands?.length > 0 ? 
      `AND b.name IN $brandNames` : '';

    const materialFilter = filters.materials?.length > 0 ? 
      `AND m.name IN $materialNames` : '';

    const colorFilter = filters.colors?.length > 0 ? 
      `AND col.name IN $colorNames` : '';

    const query = `
      MATCH (c:Category)
      WHERE c.name IN $categories
      WITH c
      MATCH (p:Product)-[r1:BELONGS_TO]->(c)
      WHERE 1=1 ${priceFilter}
      WITH c, p, r1
      
      OPTIONAL MATCH (p)-[r2:MADE_BY]->(b:Brand)
      WHERE 1=1 ${brandFilter}
      
      OPTIONAL MATCH (p)-[r3:HAS_COLOR]->(col:Color)
      WHERE 1=1 ${colorFilter}
      
      OPTIONAL MATCH (p)-[r4:HAS_MATERIAL]->(m:Material)
      WHERE 1=1 ${materialFilter}
      
      OPTIONAL MATCH (p)-[r5:HAS_STYLE]->(s:Style)
      
      WITH c, p, b, col, m, s,
           COLLECT(r1) as r1s,
           COLLECT(r2) as r2s,
           COLLECT(r3) as r3s,
           COLLECT(r4) as r4s,
           COLLECT(r5) as r5s
      WHERE (
        ANY(r IN r1s WHERE type(r) IN $relationships) OR
        ANY(r IN r2s WHERE type(r) IN $relationships) OR
        ANY(r IN r3s WHERE type(r) IN $relationships) OR
        ANY(r IN r4s WHERE type(r) IN $relationships) OR
        ANY(r IN r5s WHERE type(r) IN $relationships)
      )
      RETURN c, p, b, col, m, s,
             r1s as belongs,
             r2s as made_by,
             r3s as has_color,
             r4s as has_material,
             r5s as has_style
      LIMIT toInteger($nodeLimit)
    `;

    const session = Neo4jClient.session();
    const result = await session.run(query, {
      categories,
      relationships,
      nodeLimit,
      brandNames: filters.brands || [],
      materialNames: filters.materials || [],
      colorNames: filters.colors || []
    });

    // Transform Neo4j result into graph data
    const nodes = new Map();
    const links = [];

    result.records.forEach(record => {
      // Process nodes
      ['c', 'p', 'b', 'col', 'm', 's'].forEach(key => {
        const node = record.get(key);
        if (node && node.identity && !nodes.has(node.identity.toString())) {
          nodes.set(node.identity.toString(), {
            id: node.identity.toString(),
            name: node.properties.name || 'Unnamed',
            type: node.labels[0],
            properties: {
              ...node.properties,
              price: node.properties.price ? parseFloat(node.properties.price) : null,
              image: node.properties.image ? 
                (node.properties.image.startsWith('http') ? 
                  node.properties.image : 
                  `/images/${node.properties.image}`
                ) : null
            }
          });
        }
      });

      // Process relationships
      ['belongs', 'made_by', 'has_color', 'has_material', 'has_style'].forEach(relKey => {
        const rels = record.get(relKey);
        if (Array.isArray(rels)) {
          rels.forEach(rel => {
            if (rel && rel.start && rel.end) {
              links.push({
                source: rel.start.toString(),
                target: rel.end.toString(),
                type: rel.type,
                properties: rel.properties
              });
            }
          });
        }
      });
    });

    await session.close();

    res.status(200).json({
      nodes: Array.from(nodes.values()),
      links
    });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({
      message: 'Error fetching graph data',
      error: error.message
    });
  }
} 