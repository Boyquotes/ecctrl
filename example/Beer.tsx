import { RigidBody } from "@react-three/rapier";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Api } from "nocodb-sdk";
import * as React from 'react';
import { useRef, useMemo, useState, useEffect } from "react";
import ShotCube from "./ShotCube";
import allEnglishWords from '../public/words.txt';
// const words = fs.readFileSync('words.txt','utf8').split('\n');
// console.log(words);
console.log(allEnglishWords)

export function printAlphabet(): string[] {
  const ENGLISH = 'abcdefghijklmnopqrstuvwxyz'.split(''); // [a,b,c,d,...]
  console.log(ENGLISH)
  return ENGLISH;
}

export function printRandomConsonant(quantity : number): string[] {
  const CONSONANT = 'bcdfghjklmnpqrstvwxz'.split(''); // [a,b,c,d,...]
  console.log(CONSONANT);
  let result = new Array();
  for ( let i = 1; i<=quantity;){
    const ind: number =
    Math.floor(Math.random() * CONSONANT.length);
    console.log(ind);
    if(result.indexOf(CONSONANT[ind].toString()) > -1  === false){
      result.push(CONSONANT[ind]);
      console.log(`Random CONSONANT = ${result}`);
      i++;
    }
    else{
      console.log(`Already exist`);
    }
  }
  return result;
}

export function printRandomVowels(quantity : number): string[] {
  const VOWELS = 'aeiouy'.split('');
  console.log(VOWELS);
  let result = new Array();
  for ( let i = 1; i<=quantity;){
    const ind: number = Math.floor(Math.random() * VOWELS.length);
    console.log(ind);
    if(result.indexOf(VOWELS[ind].toString()) > -1  === false){
      result.push(VOWELS[ind]);
      i++
    }
    else{
      console.log("Already exist");
    }
    console.log(`Random VOWELS = ${result}`);
  }
  return result;
}



export default function Beer() {
  const { camera } = useThree();
  // Load models
  const beer = useGLTF("./beer.glb");
  const [blogItems, initBlog] = useState([])
  // const [voyels, initVoyels] = useState([    {
  //   id: "",
  //   name: "",
  // }])

  const api = new Api({
    baseURL: "http://37.187.141.70:8080",
    headers: {
      "xc-token": "KJW6bNF5WOJtrRXCm4rSOmQ0jfdE5T89wtoehcLe"
    }
  })
  // printAlphabet()

  const [num, setNum] = useState(0);

  // initVoyels( // Replace the state
  // [ // with a new array
  //   ...voyels, // that contains all the old items
  //   { id: nextId++, name: name } // and one new item at the end
  // ]
  // );

  // const clickToCreateBox = () => {
  //     camera.parent?.getWorldPosition(position);
  //     const newMesh = (
  //       <mesh
  //         position={[position.x, position.y - 0.5, position.z]}
  //         castShadow
  //         receiveShadow
  //       >
  //         <boxGeometry args={[0.5, 0.5, 0.5]} />
  //         <meshStandardMaterial color="orange" />
  //       </mesh>
  //     );
  //     setCubeMesh((prevMeshes) => [...prevMeshes, newMesh]);
  //     return (
  //       <>
  //         {cubeMesh.map((item, i) => {
  //           return (
  //             <RigidBody key={i} mass={0.6} ref={cubeRef}>
  //               {item}
  //             </RigidBody>
  //           );
  //         })}
  //       </>
  //     );
  //   };


  var url = "http://37.187.141.70:8080/api/v2/tables/mciuxwbs54yuoro/records?offset=0&limit=25&where=&viewId=vw8zu07t9ja74uzi";

  const [voyels, initVoyels] = useState([])
  const [consonants, initConsonant] = useState([])
  const [wordSended, initWordSended] = useState([])
  const [cubeMesh, setCubeMesh] = useState([]);
  const [cubeText, setCubeText] = useState([]);
  const [cubeRigid, setCubeRigid] = useState([]);
  const [positionX, setPositionX] = useState(5);
  const cubeRef = useRef<RapierRigidBody>();
  const position = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const listener = new THREE.AudioListener();
  const sound = new THREE.Audio( listener );
  const audioLoader = new THREE.AudioLoader();
  const [textEnglish, setTextEnglish] = useState('age');

  function MyComponent() {
    // useEffect(() => {
      let voy = printRandomVowels(4);
      let conson = printRandomConsonant(11);
      console.log("voy")
      console.log(voy)
      console.log("con")
      console.log(conson)
      initVoyels(voy)
      initConsonant(conson);
      console.log(voyels)
      printRandomConsonant(11)
    // }, [])
    // const fetchData = async () => {
    //     // Call API
    //     const response = await fetch(url,{headers: {"xc-token": "KJW6bNF5WOJtrRXCm4rSOmQ0jfdE5T89wtoehcLe"}});
    //       if (!response.ok) {
    //         throw new Error('Data coud not be fetched!')
    //       } else {
    //         console.log("response");
    //         console.log(response);
    //         return response.json()
    //       }
    //   }
      // useEffect(() => {
        // fetchData()
        //   .then((res) => {
        //     console.log("res");
        //     console.log(res);
        //     initBlog(res.list)
        //   })
        //   .catch((e) => {
        //     console.log(e.message)
        //   })
      // }, [])
    }

  useEffect(() => {
    // 👇️ Only runs once
    console.log('useEffect ran');

    function incrementNum() {
      setNum(prev => prev + 1);
    }

    incrementNum();
  }, []); // 👈️ Empty dependencies array

  useEffect(() => {
    MyComponent()
  }, [])
    // api.dbViewRow.list(
    //   "noco",
    //   "pav146hvtf72680",
    //   "mciuxwbs54yuoro",
    //   "vw8zu07t9ja74uzi", {
    //     "offset": 0,
    //     "limit": 20,
    //     "where": ""
    // }).then(async function (data) {

    //   console.log(data);
    //   console.log(data.list);
    //   console.log(data.list[0]);
    //   console.log(data.list[0].Title);
    //   console.log(data.list[0].content);
    //   return data;
    //   // data1 = await data.list[0].Title;
    //   // console.log(data1);
    // }).catch(function (error) {
    //   console.error(error);
    // });



    // const response = await fetch('https://restcountries.com/v3.1/all')
    // if (!response.ok) {
    //   throw new Error('Data coud not be fetched!')
    // } else {
    //   return response.json()
    // }


    // // Call API
    // const api = new Api({
    //   baseURL: "http://37.187.141.70:8080",
    //   headers: {
    //     "xc-token": "KJW6bNF5WOJtrRXCm4rSOmQ0jfdE5T89wtoehcLe"
    //   }
    // })
    // api.dbViewRow.list(
    //   "noco",
    //   "pav146hvtf72680",
    //   "mciuxwbs54yuoro",
    //   "vw8zu07t9ja74uzi", {
    //     "offset": 0,
    //     "limit": 20,
    //     "where": ""
    // }).then(async function (data) {

    //   console.log(data);
    //   console.log(data.list);
    //   console.log(data.list[0]);
    //   console.log(data.list[0].Title);
    //   console.log(data.list[0].content);
    //   // data1 = await data.list[0].Title;
    //   // console.log(data1);
    // }).catch(function (error) {
    //   console.error(error);
    // });

  useEffect(() => {
    // Receive Shadows
    beer.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.receiveShadow = true;
      }
    });
  }, []);

  const clickToLetter = () => {
    if (document.pointerLockElement) {
      console.log('click')
    }
  };

  const sendWord = (word) => {
      fetch(allEnglishWords)
      .then(r => r.text())
      .then(text => {
        console.log('text decoded:', text);
        setTextEnglish(text);
        // var arraycontainsturtles = (text.indexOf("eee") > -1);
        // console.log("FIND "+arraycontainsturtles);
        console.log("word")
        console.log(word)
        console.log(word.wordSended)
        var result = Object.keys(word).map((key) => [key, word[key]]);
        console.log(result)
        // console.log(word.join(''))
        let completeWord = word.wordSended.reduce((prev,curr) => {
            if (curr === '') {
                prev.push('');
            } else {
                prev[prev.length - 1] += curr;
            }
            // console.log(prev)
            return prev;
          }, [''])
        console.log(completeWord)
        console.log(completeWord[0])
        var arraycontainsturtles2 = text.includes(completeWord[0]);
        console.log("FIND2 "+arraycontainsturtles2);
      });
  }

  const sendLetter = (letter, positionX) => {
    console.log('click send 1 '+letter)
    initWordSended(wordSended => [...wordSended, letter])
    console.log(wordSended)
    console.log(wordSended.length)

    const newMesh = (
      <mesh
        position={[positionX, 1, -6]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
    const newText = (
      <Text
      rotation={[0, Math.PI, 0]}
      position={[positionX, 1, -6.51]}
      color="green"
      fontSize={0.5}
      textAlign="center"
      // position={[0, 1.5, 0]}
      // onClick={(e) => console.log('clickclick'+voyel)}
      // onClick={(e) => clickToCreateBox()}
      // onClick={(e) => sendLetter(voyel, positionX)}
      // onPointerOver={() => setHovered(true)}
      // onPointerOut={() => setHovered(false)}
    >
      {letter}
    </Text>
    );
    const newRigidB = (
      <RigidBody mass={100} key={wordSended.length}>
        {newText}
        {newMesh}
      </RigidBody>
    )

    setCubeRigid((prevRigids) => [...prevRigids, newRigidB]);
    setCubeMesh((prevMeshes) => [...prevMeshes, newMesh]);
    setCubeText((prevMeshes) => [...prevMeshes, newText]);
    setPositionX(positionX-1.3);
    // audioLoader.load( 'sound.ogg', function( buffer ) {
    audioLoader.load( 'putDown.wav', function( buffer ) {
      sound.setBuffer( buffer );
      sound.setLoop( false );
      sound.setVolume( 0.5 );
      sound.play();
    });
    return newRigidB;
  };

  // useEffect(() => {
  //   camera.parent?.getWorldDirection(direction);
  //   if (cubeMesh.length > 0) {
  //     cubeRef.current?.setLinvel(
  //       new THREE.Vector3(
  //         direction.x * 20,
  //         direction.y * 20 + 2,
  //         direction.z * 20
  //       ),
  //       false
  //     );
  //   }
  // }, [cubeMesh]);

  // console.log("blogItems av return");
  // console.log(blogItems);

  // useEffect(() => {
  //   window.addEventListener("click", () => clickToLetter());

  //   return () => {
  //     window.removeEventListener("click", () => clickToLetter());
  //   };
  // }, []);

    const [hovered, setHovered] = useState(false)
    useEffect(() => {
      document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    return (
      <group position={[0, 0, 10]}>
        <RigidBody type="fixed" colliders="trimesh" rotation={[0, Math.PI, 0]}>
          <primitive object={beer.scene} />
        </RigidBody>
          <Text
          rotation={[0, Math.PI, 0]}
          position={[-3.5, 7, 0]}
          color="black"
          fontSize={0.5}
        >
          ICI
        </Text>
        {cubeRigid.map((item, i, arr) => {
          // if (arr.length - 1 === i) {
            console.log(cubeMesh)
            return (
              <>
                {item}
              </>
              // <RigidBody key={i}>
              //   <Text
              //     scale={0.5}
              //     color="black"
              //     maxWidth={10}
              //     textAlign="center"
              //     position={[0, 1.5, 0]}
              //   >
              //   LETTEERRRR
              //   </Text>
              // {item}
              // </RigidBody>
            );
          // }
        })}

        {/* {cubeText.map((item2, i2, arr2) => {
          console.log(cubeText)
            // if (arr2.length - 1 === i2) {
              return (
                <RigidBody key={i2}>
                  {item2}
                </RigidBody>
              );
            // }
            // } else {
            //     console.log("Not last one")
            // }
        })} */}

        {consonants.map((voyel, _idx) => {
          // console.log(voyel)
          console.log(wordSended)
          return <>
            <Text
              rotation={[0, Math.PI, 0]}
              position={[3, 4+_idx, 0]}
              color="red"
              fontSize={0.5}
              // onClick={(e) => console.log('clickclick'+voyel)}
              // onClick={(e) => clickToCreateBox()}
              onClick={(e) => sendLetter(voyel, positionX)}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              {voyel}
            </Text>
          </>;
        })}

        {voyels.map((voyel, _idx) => {
          // console.log(voyel)
          console.log(wordSended)
          return <>
            <Text
              rotation={[0, Math.PI, 0]}
              position={[0, 4+_idx, 0]}
              color="red"
              fontSize={0.5}
              // onClick={(e) => console.log('clickclick'+voyel)}
              // onClick={(e) => clickToCreateBox()}
              onClick={(e) => sendLetter(voyel, positionX)}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              {voyel}
            </Text>
            <RigidBody position={[0, 1, 2]}>
              <Text
                scale={0.5}
                color="black"
                maxWidth={10}
                textAlign="center"
                position={[0, 1.5, 0]}
              >
              LETTEERRRR
              </Text>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={"lightsteelblue"} />
              </mesh>
            </RigidBody>
          </>;
        })}
        {/* <ShotCube /> */}
      {/* {blogItems.map((item, _idx) => {
        console.log(item);
        console.log(_idx);
        console.log(item.Id);
        console.log(item.Title);

        return         <Text
        rotation={[0, Math.PI, 0]}
        position={[15, 4+_idx, 0]}
        color="red"
        fontSize={0.5}
      >
        title : {item.Title}
      </Text>;
      })} */}

            <group position={[-3, 1, -10]} onClick={(e) => sendWord({wordSended})}>
              <Text
                scale={0.5}
                color="black"
                maxWidth={10}
                textAlign="center"
                position={[0, 1, 0]}
                rotation={[0, Math.PI/1.4, 0]}
              >
              Submit Word
              </Text>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={"lightsteelblue"} />
              </mesh>
            </group>  


      </group>
    );
  
}
