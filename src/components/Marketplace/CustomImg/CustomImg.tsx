import React, { useRef, useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import styles from './CustomImg.module.css'

export default function CustomImg({ className = '', src = '' }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  const onLoad = () => {
    setLoaded(true)
  }

  useEffect(() => {
    if (imgRef && imgRef.current?.complete) {
      onLoad()
    }
  }, [])

  return (
    <div className={styles.imgContent}>
      {!loaded && (
        <CircularProgress
          style={{
            width: 20,
            height: 20,
            marginRight: 6,
            color: 'red',
          }}
          color="secondary"
        />
      )}
      <img
        ref={imgRef}
        className={[styles.nftImg, className].join(' ')}
        style={loaded ? {} : { display: 'none' }}
        src={src}
        onLoad={onLoad}
        alt="nft"
      />
    </div>
  )
}
