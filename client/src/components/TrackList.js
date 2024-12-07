import React from 'react'
import PropTypes from 'prop-types'

import { StyledTrackList } from '../styles'
import { formatDuration } from '../util'


const TrackList = ({ tracks }) => (
  <div>
    {tracks && tracks.length > 0 ? (
      <StyledTrackList>
        {tracks.map((track, index) => (
          <li className="track__item" key={index}>
            <div className="track__item__num">{index + 1}</div>
            <div className="track__item__title-group">
              {track.album.images && track.album.images.length > 0 && track.album.images[2] && (
                <div className="track__item__img">
                  <img src={track.album.images[2].url} alt={track.name} />
                </div>
              )}
              <div className="track__item__name-artist">
                <div className="track__item__name overflow-ellipsis">
                  {track.name}
                </div>
                <div className="track__item__artist overflow-ellipsis">
                  {track.artists.map((artist, index) => (
                    <span key={index}>
                      {artist.name}
                      {index !== track.artists.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="track__item__album overflow-ellipsis">
              {track.album.name}
            </div>
            <div className="track__item__duration">
              {formatDuration(track.duration_ms)}
            </div>
          </li>
        ))}
      </StyledTrackList>
    ) : (
      <p className="empty-notice">No tracks available</p>
    )}
  </div>
)

TrackList.propTypes = {
  track: PropTypes.object.isRequired,
}


export default TrackList