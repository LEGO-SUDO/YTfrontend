import React from 'react'
import styled from 'styled-components'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined'
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined'
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined'
import Comments from '../components/Comments'

import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector, shallowEqual } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { fetchSuccess, like, dislike } from '../redux/videoSlice'
import { format } from 'timeago.js'
import { subscription } from '../redux/userSlice'
import Recommendation from '../components/Recommendation'

const Container = styled.div`
  display: flex;
  gap: 24px;
`

const Content = styled.div`
  flex: 5;
`
const VideoWrapper = styled.div``

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`

const ChannelName = styled.span`
  font-weight: 500;
`

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`

const Description = styled.p`
  font-size: 14px;
`

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`

const VideoFrame = styled.video`
max-height: 72px
width:50%
object-fit: cover
`

const Video = () => {
  //const { currentVideo } = useSelector((state) => state.video)
  const [currentVideo, setCurrentVideo] = useState({})

  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const path = useLocation().pathname.split('/')[2]

  const [channel, setChannel] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(
          `https://legotube-api.onrender.com/api/videos/find/${path}`
        )
        const channelRes = await axios.get(
          `https://legotube-api.onrender.com/api/users/find/${videoRes.data.userId}`
        )
        console.log(videoRes.data)
        setChannel(channelRes.data)
        setCurrentVideo(videoRes.data)
        dispatch(fetchSuccess(videoRes.data))
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [path, dispatch])

  const handleLike = async () => {
    await axios.put(
      `https://legotube-api.onrender.com/api/users/like/${currentVideo._id}`,
      {
        withCredentials: true,
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin':
            'https://vocal-sprite-dd6c42.netlify.app',
        },
      }
    )
    dispatch(like(currentUser._id))
  }

  const handleDislike = async () => {
    await axios.put(
      `https://legotube-api.onrender.com/api/users/dislike/${currentVideo._id}`,
      {
        withCredentials: true,
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin':
            'https://vocal-sprite-dd6c42.netlify.app',
        },
      }
    )
    dispatch(dislike(currentUser._id))
  }

  const handleSubscribe = async () => {
    currentUser.subscribedUsers.includes(channel._id)
      ? await axios.put(
          `https://legotube-api.onrender.com/api/users/unsub/${channel._id}`,
          {
            withCredentials: true,
            crossDomain: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Origin':
                'https://vocal-sprite-dd6c42.netlify.app',
            },
          }
        )
      : await axios.put(
          `https://legotube-api.onrender.com/api/users/sub/${channel._id}`,
          {
            withCredentials: true,
            crossDomain: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'Access-Control-Allow-Origin':
                'https://vocal-sprite-dd6c42.netlify.app',
            },
          }
        )
    dispatch(subscription(channel._id))
  }

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame
            // {currentVideo.videoUrl}
            src='https://www.youtube.com/watch?v=-u04JD5Eo-c'
            controls
            style={{ maxWidth: '680px' }}
          />
        </VideoWrapper>
        {/* {currentVideo.title} */}
        <Title>{channel.name}</Title>
        <Details>
          <Info>
            {' '}
            {/* {currentVideo.views} */}
            {channel.name} views • {format(currentVideo.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
              {currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSubscribe}>
            {currentUser.subscribedUsers?.includes(channel._id)
              ? 'SUBSCRIBED'
              : 'SUBSCRIBE'}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  )
}

export default Video
