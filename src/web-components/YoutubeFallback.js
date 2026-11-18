
import React from 'react';

const YoutubeIframe = ({ videoId, height, width }) => {
  return (
    <iframe
      width={width || '100%'}
      height={height || '315'}
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default YoutubeIframe;