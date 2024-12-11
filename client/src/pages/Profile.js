import React, { useEffect, useState } from 'react'
import {
  ArtistsGrid,
  Loader,
  PlaylistsGrid,
  SectionWrapper,
  TrackItem,
  TrackList
} from 'src/components'
import {
  getCurrentUserPlaylists,
  getCurrentUserProfile,
  getCurrentUserTopArtists,
  getCurrentUserTopTracks,
  getRecentlyPlayed
} from 'src/spotify'
import { StyledHeader, StyledTrackList } from 'src/styles'
import { catchErrors } from 'src/util'



const Profile = () => {
  const [profile, setProfile] = useState()
  const [playlists, setPlaylists] = useState()
  const [topArtists, setTopArtists] = useState()
  const [topTracks, setTopTracks] = useState()
  const [recentlyPlayed, setRecentlyPlayed] = useState()


  useEffect(() => {
    const fetchData = async () => {

      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile.data)

      const userPlaylists = await getCurrentUserPlaylists()
      setPlaylists(userPlaylists.data)

      const topArtists = await getCurrentUserTopArtists()
      setTopArtists(topArtists.data)

      const userRecentlyPlayed = await getRecentlyPlayed()
      setRecentlyPlayed(userRecentlyPlayed.data)

      const topTracks = await getCurrentUserTopTracks()
      setTopTracks(topTracks.data)
    }

    catchErrors(fetchData())
  }, [])

  return (
    <div>
      {profile && (
        <div>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images && profile.images.length > 0 && profile.images[0].url && (
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
                      {playlists.total === 1 ? '' : 's'}
                    </span>
                  )}
                  <span>
                    {profile.followers.total} Follower
                    {profile.followers.total === 1 ? '' : 's'}
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
                  {recentlyPlayed.items.slice(0, 10).map(({ track }, index) => (<TrackItem track={track} key={index} />))}
                </StyledTrackList>) : (<Loader />)}
            </SectionWrapper>

            <SectionWrapper title="Public Playlists" seeAllLink="/playlists">
              {playlists ? (<PlaylistsGrid playlists={playlists.items.slice(0, 10)} />) : (<Loader />)}
            </SectionWrapper>
          </main>
        </div>
      )}
    </div>
  )
}

export default Profile
