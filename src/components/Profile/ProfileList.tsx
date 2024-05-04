export interface ProfileData {
  id: number;
}

export const ProfileList = ({data}: { data: ProfileData[] }) => {

  return (
    <div>
      <h1>Profile List</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.id}</li>
        ))}
      </ul>
    </div>
  );
}
