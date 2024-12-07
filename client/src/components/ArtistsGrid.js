
import React from 'react'

import { StyledGrid } from '../styles'

const ArtistsGrid = ({ artists }) => (
  <div>
    {artists && artists.length > 0 ? (
      <StyledGrid type="artist">
        {artists.map((artist, index) => (
          <li className="grid__item" key={index}>
            <div className="grid__item__inner">
              {artist.images[0] && (
                <div className="grid__item__img">
                  <img src={artist.images[0].url} alt={artist.name} />
                </div>
              )}
              <h3 className="grid__item__name overflow-ellipsis">
                {artist.name}
              </h3>
              <p className="grid__item__label">Artist</p>
            </div>
          </li>
        ))}
      </StyledGrid>
    ) : (
      <p className="empty-notice">No artists available</p>
    )}
  </div>
)

export default ArtistsGrid
