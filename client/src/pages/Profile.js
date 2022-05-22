import React, { useEffect, useState } from "react";
import { catchErrors } from "../util";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getCurrentUserTopArtists,
  getCurrentUserTopTracks,
  getRecentlyPlayed
} from "../spotify";
import { StyledHeader, StyledTrackList } from "../styles";
import {
  SectionWrapper,
  ArtistsGrid,
  TrackList,
  PlaylistsGrid,
  Loader,
  TrackItem
} from "../components";



const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      console.log(`fetching data`);

      const userProfile = await getCurrentUserProfile();
      console.log(`userProfile: ${userProfile.data}`);
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);
      console.log(`userPlaylists: ${userPlaylists.data}`);

      const topArtists = await getCurrentUserTopArtists();
      setTopArtists(topArtists.data);
      console.log(`topArtists: ${topArtists}`);

      const userRecentlyPlayed = await getRecentlyPlayed();
      setRecentlyPlayed(userRecentlyPlayed.data);
      // console.log(userRecentlyPlayed.data.items.slice(0, 10));
      // setRecentlyPlayed(topArtists.data);
      console.log(`recentlyPlayed: ${userRecentlyPlayed}`);

      const topTracks = await getCurrentUserTopTracks();
      setTopTracks(topTracks.data);
      console.log(`topTracks: ${topTracks}`);

      // catchErrors(fetchData());
      console.log(`finished fetching data`);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div>
      {profile && (
        <div>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[0].url && (
                <p>
                  <img
                    className="header__img"
                    src={profile.images[0].url}
                    alt="profile-pic"
                  />
                </p>
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>
                      {playlists.total} Playlist
                      {playlists.total !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span>
                    {profile.followers.total} Follower
                    {profile.followers.total !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          <main>
            <SectionWrapper title="Top artists this month" seeAllLink="/top-artists">
              {topArtists ? (<ArtistsGrid artists={topArtists.items.slice(0, 10)} />) : (<Loader />)}
            </SectionWrapper>

            <SectionWrapper title="Top tracks this month" seeAllLink="/top-tracks">
              {topTracks ? (<TrackList tracks={topTracks.items.slice(0, 10)} />) : (<Loader />)}
            </SectionWrapper>

            <SectionWrapper title="Recently Played" seeAllLink="/recently-played">
              {/* {topTracks ? (<TrackList tracks={topTracks.items.slice(0, 10)} />) : (<Loader />)} */}
              {/* {recentlyPlayed ? (<TrackList tracks={recentlyPlayed.data.items.slice(0, 10)} />) : (<Loader />)} */}
              {recentlyPlayed ? (
                <StyledTrackList>
                  {recentlyPlayed.items.slice(0, 10).map(({ track }, i) => (<TrackItem track={track} key={i} />))}
                </StyledTrackList>) : (<Loader />)}
            </SectionWrapper>

            <SectionWrapper title="Public Playlists" seeAllLink="/playlists">
              {playlists ? (<PlaylistsGrid playlists={playlists.items.slice(0, 10)} />) : (<Loader />)}
            </SectionWrapper>
          </main>
        </div>
      )}
    </div>
  );
};

export default Profile;
