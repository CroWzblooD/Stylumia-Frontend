'use client';
import { ModelViewer } from 'react-3d-viewer';

const CustomModelViewer = ({ src, className }) => {
  return (
    <div className={className}>
      <ModelViewer
        src={src}
        width="100%"
        height="100%"
        position={{ x: 0, y: 0, z: 0 }}
        rotate={true}
        backgroundColor="#ffffff"
      />
    </div>
  );
};

export default CustomModelViewer; 