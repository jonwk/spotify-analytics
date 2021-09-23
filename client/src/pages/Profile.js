import { useEffect, useState } from "react";
import { catchErrors } from "../util";
import { getCurrentUserProfile } from "../spotify";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`fetching data`);
      const { data } = await getCurrentUserProfile();
      console.log(`data: \n ${JSON.stringify(data)}`);
      setProfile(data);
      console.log(`finished fetching data`);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div>
      {profile && (
        <div>
          <h1>{profile.display_name}</h1>
          <p>{profile.email}</p>
          <p>
            Profile URL : <a href={profile.external_urls.spotify}>Link</a>
          </p>
          <p>Followers : {profile.followers.total}</p>
          {profile.images.length && profile.images[0].url && (
            <p>
              <img src={profile.images[0].url} alt="profile-pic" />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
