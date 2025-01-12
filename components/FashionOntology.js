import { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { FiFilter, FiZoomIn, FiZoomOut, FiInfo } from 'react-icons/fi';
import Image from 'next/image';

const FashionOntology = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedCategories, setSelectedCategories] = useState(['shirts', 'dresses']);
  const [showRelationships, setShowRelationships] = useState({
    BELONGS_TO: true,
    MADE_BY: true,
    HAS_COLOR: true,
    HAS_MATERIAL: true,
    HAS_STYLE: true
  });
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    brands: [],
    materials: [],
    colors: [],
    styles: []
  });
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    materials: [],
    colors: [],
    styles: []
  });
  const [loading, setLoading] = useState(true);
  const [nodeLimit, setNodeLimit] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const graphRef = useRef();

  // Fetch available filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/ontology/filters');
      const data = await response.json();
      setAvailableFilters(data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchGraphData = async () => {
    try {
      const response = await fetch('/api/ontology/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: selectedCategories,
          relationships: Object.keys(showRelationships).filter(key => showRelationships[key]),
          limit: nodeLimit,
          filters
        })
      });
      const data = await response.json();
      setGraphData(data);
      setLoading(false);

      // Center the graph after data loads
      if (graphRef.current) {
        setTimeout(() => {
          graphRef.current.zoomToFit(400);
          graphRef.current.centerAt();
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [selectedCategories, showRelationships, nodeLimit, filters]);

  const nodeColors = {
    Category: '#FF6B6B',
    Product: '#4ECDC4',
    Brand: '#45B7D1',
    Material: '#96CEB4',
    Color: '#FFEEAD',
    Style: '#D4A5A5'
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleZoom = (direction) => {
    const graph = graphRef.current;
    if (graph) {
      const currentZoom = graph.zoom();
      graph.zoom(currentZoom + (direction === 'in' ? 0.2 : -0.2));
    }
  };

  // Enhanced node information display component
  const NodeInfo = ({ node }) => {
    if (!node) return null;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            {node.type}: {node.name}
          </h3>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-6">
          {/* Show image for products */}
          {node.type === 'Product' && node.properties.image && (
            <div className="w-full md:w-1/3">
              <div className="relative h-[200px] w-full rounded-lg overflow-hidden">
                <Image
                  src={node.properties.image}
                  alt={node.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          )}

          {/* Properties */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(node.properties || {}).map(([key, value]) => {
                // Skip image property as it's displayed separately
                if (key === 'image') return null;
                
                return (
                  <div key={key} className="space-y-1">
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {key === 'price' ? `₹${value}` : value}
                    </dd>
                  </div>
                );
              })}
            </div>

            {/* Related Nodes */}
            {node.type === 'Product' && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Related Information</h4>
                <div className="flex flex-wrap gap-2">
                  {graphData.links
                    .filter(link => link.source.id === node.id || link.target.id === node.id)
                    .map((link, idx) => {
                      const relatedNode = graphData.nodes.find(n => 
                        n.id === (link.source.id === node.id ? link.target.id : link.source.id)
                      );
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${nodeColors[relatedNode.type]}20`,
                            color: nodeColors[relatedNode.type]
                          }}
                        >
                          {link.type}: {relatedNode.name}
                        </span>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6 p-6 max-w-[1920px] mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Fashion Knowledge Graph</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiFilter />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* Selected Node Information */}
      {selectedNode && <NodeInfo node={selectedNode} />}

      {/* Filters Panel */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-white p-6 rounded-xl shadow-sm ${showFilters ? 'block' : 'hidden'}`}>
        {/* Categories */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categories</label>
          <select
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {['shirts', 'dresses', 'jeans', 'saree', 'sneakers', 'tshirts', 'earrings', 'kurtis'].map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Brands Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Brands</label>
          <select
            multiple
            value={filters.brands}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              brands: Array.from(e.target.selectedOptions, option => option.value)
            }))}
            className="w-full p-2 border rounded-lg"
          >
            {availableFilters.brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Materials Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Materials</label>
          <select
            multiple
            value={filters.materials}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              materials: Array.from(e.target.selectedOptions, option => option.value)
            }))}
            className="w-full p-2 border rounded-lg"
          >
            {availableFilters.materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        {/* Colors Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Colors</label>
          <select
            multiple
            value={filters.colors}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              colors: Array.from(e.target.selectedOptions, option => option.value)
            }))}
            className="w-full p-2 border rounded-lg"
          >
            {availableFilters.colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => setFilters(prev => ({...prev, priceRange: [Number(e.target.value), prev.priceRange[1]]}))}
              className="w-1/2 p-2 border rounded-lg"
              placeholder="Min"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({...prev, priceRange: [prev.priceRange[0], Number(e.target.value)]}))}
              className="w-1/2 p-2 border rounded-lg"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Relationships */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Show Relationships</label>
          <div className="space-y-2">
            {Object.keys(showRelationships).map(relationship => (
              <div key={relationship} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRelationships[relationship]}
                  onChange={() => setShowRelationships(prev => ({
                    ...prev,
                    [relationship]: !prev[relationship]
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{relationship}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Limit */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Node Limit: {nodeLimit}</label>
          <input
            type="range"
            min="100"
            max="5000"
            value={nodeLimit}
            onChange={(e) => setNodeLimit(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: '70vh' }}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <button
                onClick={() => handleZoom('in')}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <FiZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              >
                <FiZoomOut className="w-5 h-5" />
              </button>
            </div>
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeColor={node => nodeColors[node.type] || '#999'}
              nodeLabel={node => `${node.type}: ${node.name}`}
              linkLabel={link => link.type}
              linkColor={() => '#999'}
              linkWidth={1}
              nodeRelSize={6}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              d3AlphaDecay={0.01}
              d3VelocityDecay={0.08}
              cooldownTicks={100}
              onNodeClick={handleNodeClick}
              linkDirectionalArrowLength={3.5}
              linkDirectionalArrowRelPos={1}
              onEngineStop={() => {
                if (graphRef.current) {
                  graphRef.current.zoomToFit(400);
                }
              }}
            />
          </>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(nodeColors).map(([type, color]) => (
            <div key={type} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-sm text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FashionOntology;