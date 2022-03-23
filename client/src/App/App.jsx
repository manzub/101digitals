import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useQuery } from 'react-query';
import Loading from "../components/Loading";
import Notice from "../components/Notice";
import { sessionId } from "../helpers/helpers";
import backendApi from "../utils/backendApi";
import Content from "./Content";
import { socket } from "./socket";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  dissmissComponent() {
    window.location.reload();
  }

  render() {
    if(this.state.hasError) {
      return (<Notice title="Error" message="Something went wrong!." actionText="Dismiss" actionClicked={this.dissmissComponent} />)
    }

    return this.props.children;
  }
}


function App({ loaded, chatroom }) {
  const dispatch = useDispatch();
  const myroomId = sessionId(); 

  // eslint-disable-next-line no-unused-vars
  const [connected, setConnected] = useState(false);

  useQuery('services', () => {
    return backendApi.getServices();
  }, { onSuccess: function(data) {
    if(data.status === 1) dispatch({ type: 'LOADED', payload: { services: data.services } })
  } })

  useEffect(() => {
    const eventHandler = () => setConnected(!connected);
    socket.emit('connect-client', myroomId);

    socket.on('messages', (messages) => {
      dispatch({ type: 'SOCKET', payload: socket })
      dispatch({ type: 'MESSAGES', payload: messages[chatroom ? chatroom : myroomId] || [] })
      eventHandler();
    });
    return () => socket.off('messages', eventHandler);
  }, [])

  return (<div style={{fontFamily:'Montserrat'}} className='bg-white dark:bg-gray-700 transition-all min-h-screen'>
    {/* add loading and content widget */}
    { loaded ? <Content /> : <Loading/>}
  </div>);
}

export default connect(state => state.app)(App);
