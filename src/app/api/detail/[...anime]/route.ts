import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "@/lib/Response";
import SiteConfig from "@/lib/SiteConfig";
import { NextResponse } from "next/server";
const cheerio = require("cheerio");
const baseURL = SiteConfig.scrapUrl;

type EpsType = { episodeId: any; epsTitle: any };

interface IDetailAnime {
  type: string;
  title: string;
  englishTitle: string;
  synopsis: string;
  status: string;
  image: string;
  ratings: string;
  animeQuality: string;
  totalEps: string;
  aired: string;
  season: string;
  duration: string;
  country: string;
  adaptation: string;
  genres: string;
  explisit: string;
  demografis: string;
  theme: string;
  skors: string;
  studio: string;
  peminat: string;
  ratingText: string;
  credit: string;
  episode: Array<EpsType>;
}

export async function GET(
  req: Request,
  { params }: { params: { anime: string[] } }
) {
  const animeId = `${params.anime[0]}/${params.anime[1]}/${params.anime[2]}`;

  try {
    const rawResponse = await fetch(`${baseURL}/${animeId}`);
    const html = await rawResponse.text();
    const $ = cheerio.load(html);

    const el = $("body > section > div > div.anime__details__content");

    let datas: Array<IDetailAnime> = [];

    let episode = $("#episodeLists").attr("data-content");
    const $$ = cheerio.load(episode);

    let episodeArray: Array<EpsType> = [];
    $$("a").each((i: any, e: any) => {
      const eps = $(e).attr("href").trim().replace(`${baseURL}`, "");
      const epsTitle = $(e).text().trim().replace(/\s+/g, " ");
      episodeArray.push({
        episodeId: eps,
        epsTitle: epsTitle,
      });
    });

    el.each((i: any, e: any) =>
      datas.push({
        type: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(1) > a"
          )
          .text(),
        title: $(e)
          .find(" div.col-lg-9 > div > div.anime__details__title > h3")
          .text(),
        englishTitle: $(e)
          .find("div.col-lg-9 > div > div.anime__details__title > span")
          .text(),
        synopsis: $(e).find("#synopsisField").text(),
        status: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(3) > a"
          )
          .text(),
        image: $(e).find(" div.col-lg-3 > div").attr("data-setbg"),
        ratings: $(e)
          .find(" div.col-lg-3 > div > div.ep")
          .text()
          .replace(/\s+/g, " "),
        animeQuality: $(e).find(" div.col-lg-3 > div > div.ep-v2").text(),
        totalEps: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(2) > a"
          )
          .text(),
        aired: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul"
          )
          .text()
          .match(/\d{1,2}\s+\w+\s+\d{4}\s+s\/d\s+/)
          ? $(e)
              .find(
                "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul"
              )
              .text()
              .match(/\d{1,2}\s+\w+\s+\d{4}\s+s\/d\s+/)[0]
              .trim()
          : "?",
        season: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(5) > a"
          )
          .text(),
        duration: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(6) > a"
          )
          .text(),
        country: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(8) > a"
          )
          .text(),
        adaptation: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(1) > ul > li:nth-child(9) > a"
          )
          .text(),
        genres: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(1) > a"
          )
          .text()
          .split(",\n")
          .map((genre: string) => genre.trim()),
        explisit: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(2) > a"
          )
          .text(),
        demografis: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(3) > a"
          )
          .text()
          .replace(/\s+/g, "" ? "?" : ""),
        theme: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(4) > a"
          )
          .text()
          .replace(/\s+/g, " "),
        skors: $(e)
          .find(
            " div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(6) > a"
          )
          .text(),
        studio: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(5) > a"
          )
          .text()
          .replace(/\s+/g, " "),
        peminat: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(7) > a"
          )
          .text()
          .replace(/\s+/g, " "),
        ratingText: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(8) > a"
          )
          .text()
          .replace(/\s+/g, " "),
        credit: $(e)
          .find(
            "div.col-lg-9 > div > div.anime__details__widget > div > div:nth-child(2) > ul > li:nth-child(9) > a"
          )
          .text()
          .trim()
          .replace(/\s+/g, " "),
        episode: episodeArray,
      })
    );

    return NextResponse.json(responseSuccessWithData(datas[0]));
  } catch (error) {
    console.log("Detail Error: ", error);

    return NextResponse.json(responseErrorWithMessage());
  }
}
