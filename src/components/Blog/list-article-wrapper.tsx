import { ListArticleComponent } from "./index";
import { getListArticle } from "./fetch";

export async function ListArticleWrapper() {
  const data = await getListArticle();

  return <ListArticleComponent data={data} />;
}