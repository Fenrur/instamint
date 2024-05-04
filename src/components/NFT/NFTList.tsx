export interface NFTData {
  id: number;

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
