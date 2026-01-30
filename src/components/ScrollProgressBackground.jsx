export default function ScrollProgressBackground({ opacity }) {
  return (
    <div 
      className="scroll-background-layer" 
      aria-hidden="true"
      style={{ opacity }}
    />
  );
}
