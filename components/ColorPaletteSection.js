const ColorPaletteSection = ({ colors = [] }) => {
  if (!colors || colors.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-semibold mb-4">Color Palette</h3>
        <p className="text-gray-500">No colors detected</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h3 className="text-xl font-semibold mb-4">Color Palette</h3>
      <div className="grid grid-cols-2 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-sm text-gray-600">
              {color.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteSection; 