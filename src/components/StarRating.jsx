export default function StarRating({ stars, size = 'md' }) {
  const sizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' };
  return (
    <div className={`flex gap-1 ${sizes[size]}`}>
      {[1,2,3].map(i => (
        <span key={i} className={i <= stars ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}
