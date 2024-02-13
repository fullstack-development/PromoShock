import { ProductTemplate, RecommendedTemplate } from "@acne-shop/templates";

function ProductPage({ params }: { params: { id: string } }) {
  return (
    <>
      <ProductTemplate productId={params.id} />
      <RecommendedTemplate productId={params.id} />
    </>
  );
}

export default ProductPage;
