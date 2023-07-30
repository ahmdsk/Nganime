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

export enum AnimeType {
  ongoing = "ongoing",
  onfinished = "onfinished",
  search = "search"
}

export interface IProps {
  order_by?: string;
  page?: number | string;
  type: AnimeType;
  query?: string;
}

export const baseURL = SiteConfig.scrapUrl;

export default async function ScrapMethod(props: IProps) {
  let url = `${baseURL}/anime/${props.type}?order_by=${props.order_by}&page=${props.page}`;

  if(props.type === AnimeType.search) {
    if(props.query !== "") {
      url = `${baseURL}/anime?search=${props.query}&order_by=${props.order_by}&page=${props.page}`;
    }
  }

  const rawResponse = await fetch(url);
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
