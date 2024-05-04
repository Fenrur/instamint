import {useEffect, useState} from "react";
import {DateTime} from "luxon";

export interface SearchProps {
  query: string;
  minPrice: number;
  maxPrice: number;
  location: string;
}

export interface NFTData {
  id: number;
  contentUrl: string;
  mintCount: number;
  commentCount: number;
  postedAt: DateTime<true>;
  type: string

}

export const NFTList = ({data}: { data: NFTData[] }) => {

  return (
    <div>
      <h1>NFT List</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.id}</li>
        ))}
      </ul>
    </div>
  );
}
