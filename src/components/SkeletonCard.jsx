import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line price"></div>
    </div>
  );
}

export default SkeletonCard;
