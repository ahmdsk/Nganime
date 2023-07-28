import SiteConfig from "./SiteConfig";
const cheerio = require("cheerio");

export interface IResMovie {
  title: string;
  animeId: string;
  image: string;
  episode: string;
  category?: Array<{
    name: string;
    link: string;
  }>;
}

export interface IProps {
  order_by?: string;
  page?: number | string;
  type: string;
}

export const baseURL = SiteConfig.scrapUrl;

export default async function ScrapMethod(props: IProps) {
  const rawResponse = await fetch(
    `${baseURL}/anime/${props.type}?order_by=${props.order_by}&page=${props.page}`
  );
  const html = await rawResponse.text();

  const $ = cheerio.load(html);
  const el = $("#animeList > div > .product__item");

  const data: Array<IResMovie> = [];

  el.each((i: number, e: any) => {
    const category: Array<{
      name: string;
      link: string;
    }> = [];

    // Get Category
    $(e)
      .find("div.product__item__text > ul > a")
      .each((i: number, ec: any) => {
        category.push({
          link: $(ec).attr("href").replace(`${baseURL}`, ""),
          name: $(ec).text()
        });
      });

    data.push({
      title: $(e).find("div.product__item__text > h5 > a").text(),
      animeId: $(e).find("div.product__item__text > h5 > a").attr("href")
        ? $(e).find("div > h5 > a").attr("href").replace(`${baseURL}`, "")
        : "",
      image: $(e).find("a > div").attr("data-setbg"),
      episode: $(e).find("a > div > div.ep > span").text().trim(),
      category
    });
  });

  return data;
}
