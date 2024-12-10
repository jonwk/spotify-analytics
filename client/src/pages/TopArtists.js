import React, { useEffect, useState } from 'react'
import { ArtistsGrid, Loader, SectionWrapper, TimeRangeButtons } from 'src/components'
import { getCurrentUserTopArtists } from 'src/spotify'
import { catchErrors } from 'src/util'


const TopArtists = () => {
    const [topArtists, setTopArtists] = useState()
    const [activeRange, setActiveRange] = useState('short')

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getCurrentUserTopArtists(`${activeRange}_term`)
            setTopArtists(data)
        }

        catchErrors(fetchData())
    }, [activeRange])

    return (
        <main>
            <SectionWrapper title="Top Artists" breadcrumb={true}>
                <TimeRangeButtons
                    activeRange={activeRange}
                    setActiveRange={setActiveRange}
                />

                {topArtists && topArtists.items ? (
                    <ArtistsGrid artists={topArtists.items} />
                ) : (
                    <Loader />
                )}
            </SectionWrapper>
        </main>
    )
}

export default TopArtists
