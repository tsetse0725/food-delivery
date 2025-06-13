
export default function RightSection({ src }: { src: string }) {
  return (
    <div className="w-1/2 h-screen hidden md:block">
      <img src={src} alt="Delivery" className="w-full h-full object-cover" />
    </div>
  );
}