import React from 'react'
import { Link } from 'react-router-dom'
import { StyledGrid } from 'src/styles'

const PlaylistsGrid = ({ playlists }) => (
  <div>
    {playlists && playlists.length > 0 ? (
      <StyledGrid>
        {playlists.map((playlist, index) => (
          <li className="grid__item" key={index}>
            <Link
              className="grid__item__inner"
              to={`/playlists/${playlist.id}`}
            >
              {playlist.images && playlist.images.length > 0 && playlist.images[0] && (
                <div className="grid__item__img">
                  <img src={playlist.images[0].url} alt={playlist.name} />
                </div>
              )}
              <h3 className="grid__item__name overflow-ellipsis">
                {playlist.name}
              </h3>
              <p className="grid__item__label">Playlist</p>
            </Link>
          </li>
        ))}
      </StyledGrid>
    ) : (
      <p className="empty-notice">No playlists available</p>
    )}
  </div>
)

export default PlaylistsGrid
