import { IDetailAnime } from "@/interface/DetailAnime";
import { EpsType } from "@/interface/Episode";
import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "@/lib/Response";
import SiteConfig from "@/lib/SiteConfig";
import { NextResponse } from "next/server";
const cheerio = require("cheerio");
const baseURL = SiteConfig.scrapUrl;

export async function GET(
  req: Request,
  { params }: { params: { anime: Array<string> } }
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

    el.each((i: any, e: any) => {
      const animeDetailEl = "div.col-lg-9 > div > div.anime__details__widget > div";

      datas.push({
        type: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(1) > a`
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
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(3) > a`
          )
          .text(),
        image: $(e).find(" div.col-lg-3 > div").attr("data-setbg"),
        ratings: $(e)
          .find(" div.col-lg-3 > div > div.ep")
          .text()
          .trim(),
        animeQuality: $(e).find(" div.col-lg-3 > div > div.ep-v2").text(),
        totalEps: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(2) > a`
          )
          .text(),
        aired: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul`
          )
          .text()
          .match(/\d{1,2}\s+\w+\s+\d{4}\s+s\/d\s+/)
          ? $(e)
              .find(
                `${animeDetailEl} > div:nth-child(1) > ul`
              )
              .text()
              .match(/\d{1,2}\s+\w+\s+\d{4}\s+s\/d\s+/)[0]
              .trim()
          : "?",
        season: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(5) > a`
          )
          .text(),
        duration: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(6) > a`
          )
          .text(),
        country: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(8) > a`
          )
          .text(),
        adaptation: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(1) > ul > li:nth-child(9) > a`
          )
          .text(),
        genres: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(1) > a`
          )
          .text()
          .split(",\n")
          .map((genre: string) => genre.trim()),
        explicit: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(2) > a`
          )
          .text(),
        demographics: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(3) > a`
          )
          .text()
          .replace(/\s+/g, "" ? "?" : ""),
        theme: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(4) > a`
          )
          .text()
          .replace(/\s+/g, " "),
        scors: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(6) > a`
          )
          .text(),
        studio: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(5) > a`
          )
          .text()
          .replace(/\s+/g, " "),
        interested: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(7) > a`
          )
          .text()
          .replace(/\s+/g, " "),
        ratingText: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(8) > a`
          )
          .text()
          .replace(/\s+/g, " "),
        credit: $(e)
          .find(
            `${animeDetailEl} > div:nth-child(2) > ul > li:nth-child(9) > a`
          )
          .text()
          .trim()
          .replace(/\s+/g, " "),
        episode: episodeArray,
      });
    });

    return NextResponse.json(responseSuccessWithData(datas[0]));
  } catch (error) {
    console.log("Detail Error: ", error);

    return NextResponse.json(responseErrorWithMessage());
  }
}
