import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { loginFailure, loginStart, loginSuccess } from '../redux/userSlice'
import { auth, provider } from '../firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`

const Title = styled.h1`
  font-size: 24px;
`

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`

const Links = styled.div`
  margin-left: 50px;
`

const Link = styled.span`
  margin-left: 30px;
`

const SignIn = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(loginStart())

    try {
      const res = await axios.post(
        'https://videotube.adaptable.app/api/auth/signin',
        { name, password },
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
      dispatch(loginSuccess(res.data))
      navigate('/random')
    } catch (err) {
      dispatch(loginFailure())
    }
  }

  const handleSignup = async (e) => {
    const res = await axios.post(
      'https://videotube.adaptable.app/api/auth/signup',
      { name, email, password },
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
    dispatch(loginSuccess(res.data))
    navigate('/random')
  }

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(
            'https://videotube.adaptable.app/api/auth/google',
            {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            },
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
          .then((res) => {
            dispatch(loginSuccess(res.data))
            navigate('/random')
          })
      })
      .catch((error) => {
        dispatch(loginFailure())
      })
  }
  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to LegoTube</SubTitle>
        <Input
          placeholder='username'
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type='password'
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Sign in</Button>

        <Title>or</Title>

        <Button onClick={signInWithGoogle}> Signin with Google</Button>

        <Title>or</Title>

        <Input
          placeholder='username'
          onChange={(e) => setName(e.target.value)}
        />
        <Input placeholder='email' onChange={(e) => setEmail(e.target.value)} />
        <Input
          type='password'
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignup}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  )
}

export default SignIn
