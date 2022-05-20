import { useState, useEffect } from 'react';
import { getCurrentUserTopArtists } from '../spotify';
import { catchErrors } from '../util';
import { ArtistsGrid, SectionWrapper, TimeRangeButtons, Loader } from '../components';


const TopArtists = () => {
    const [topArtists, setTopArtists] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getCurrentUserTopArtists(`${activeRange}_term`);
            setTopArtists(data);
        };

        catchErrors(fetchData());
    }, [activeRange]);

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
    );
};

export default TopArtists;
