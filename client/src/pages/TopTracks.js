import React, { useEffect, useState } from 'react'
import { Loader, SectionWrapper, TimeRangeButtons, TrackList } from 'src/components'
import { getCurrentUserTopTracks } from 'src/spotify'
import { catchErrors } from 'src/util'

const TopTracks = () => {
    const [topTracks, setTopTracks] = useState()
    const [activeRange, setActiveRange] = useState('short')

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getCurrentUserTopTracks(`${activeRange}_term`)
            setTopTracks(data)
        }

        catchErrors(fetchData())
    }, [activeRange])

    return (
        <main>
            <SectionWrapper title="Top Tracks" breadcrumb={true}>
                <TimeRangeButtons
                    activeRange={activeRange}
                    setActiveRange={setActiveRange}
                />

                {topTracks && topTracks.items ? (
                    <TrackList tracks={topTracks.items} />
                ) : (
                    <Loader />
                )}
            </SectionWrapper>
        </main>
    )
}

export default TopTracks