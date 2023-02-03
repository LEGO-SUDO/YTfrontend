import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Card from './Card'
import axios from 'axios'

const Container = styled.div`
  flex: 2;
`

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(
        `https://videotube.adaptable.app/api/videos/tags?tags=${tags}`,
        null,
        { withCredentials: true }
      )
      setVideos(res.data)
    }
    fetchVideos()
  }, [tags])

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  )
}

export default Recommendation
