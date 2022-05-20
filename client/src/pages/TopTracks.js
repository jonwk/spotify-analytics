import { useState, useEffect } from 'react';
import { getCurrentUserTopTracks } from '../spotify';
import { catchErrors } from '../util';
import { SectionWrapper, TrackList, TimeRangeButtons } from '../components';

const TopTracks = () => {
  const [topTracks, setTopTracks] = useState(null);
  const [activeRange, setActiveRange] = useState('short');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserTopTracks(`${activeRange}_term`);
      setTopTracks(data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <main>
      <SectionWrapper title="Top Tracks" breadcrumb={true}>
        <TimeRangeButtons
          activeRange={activeRange}
          setActiveRange={setActiveRange}
        />

        {topTracks && topTracks.items && (
          <TrackList tracks={topTracks.items} />
        )}
      </SectionWrapper>
    </main>
  );
};

export default TopTracks;