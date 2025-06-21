import { extend } from '@react-three/fiber'
import { RigidBody } from "@react-three/rapier";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { useThree, Canvas } from "@react-three/fiber";
// import { Api } from "nocodb-sdk";
import * as React from 'react';
import { useRef, useMemo, useState, useEffect } from "react";
import ShotCube from "./ShotCube";
import CountDown from "./CountDown";
// Corrige l'import du fichier de mots : retire l'import direct
// import allEnglishWords from '../public/words20k.txt';
const allEnglishWordsUrl = '/words20k.txt';
// const allEnglishWordsUrl = '/wordLight.txt';
// import { log } from "three/examples/jsm/nodes/Nodes.js";
// import allEnglishWords from '../public/example.txt';
// const words = fs.readFileSync('words.txt','utf8').split('\n');
// console.log(words);
console.log(allEnglishWordsUrl)

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



export default function GameWords() {
  const { camera } = useThree();
  // Load models
  // const beer = useGLTF("./beer.glb");
  const [blogItems, initBlog] = useState([])
  // const [voyels, initVoyels] = useState([    {
  //   id: "",
  //   name: "",
  // }])

//   const api = new Api({
//     baseURL: "http://37.187.141.70:8080",
//     headers: {
//       "xc-token": "KJW6bNF5WOJtrRXCm4rSOmQ0jfdE5T89wtoehcLe"
//     }
//   })
  // printAlphabet()

  const [num, setNum] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(90);

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

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState(null);
  const [voyels, initVoyels] = useState<string[]>([]);
  const [consonants, initConsonant] = useState<string[]>([]);
  const [wordSended, setWordSended] = useState<string[]>([]);
  const [cubeMesh, setCubeMesh] = useState<React.ReactElement[]>([]);
  const [cubeText, setCubeText] = useState<React.ReactElement[]>([]);
  const [cubeRigid, setCubeRigid] = useState<React.ReactElement[]>([]);
  const [positionX, setPositionX] = useState(5);
  const cubeRef = useRef<any>();
  const position = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const listener = new THREE.AudioListener();
  const sound = new THREE.Audio( listener );
  const audioLoader = new THREE.AudioLoader();
  const [textEnglish, setTextEnglish] = useState('age');
  const [cubeSuccess, setCubeVerify] = useState<React.ReactElement | null>(null);
  const [successWord, setSuccessWord] = useState<string>("");
  const [successWords, setSuccessWords] = useState<string[]>([]);
  const [showSolver, setShowSolver] = useState(false);
  const [solverWords, setSolverWords] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const [preComputedWords, setPreComputedWords] = useState<string[]>([]);
  const [solverComputing, setSolverComputing] = useState(false);

  const deleteItem = (index) => {
    const newArray = [
      ...cubeRigid.slice(0, index), // Elements before the one to delete
      ...cubeRigid.slice(index + 1) // Elements after the one to delete
    ];
    setCubeRigid(newArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(allEnglishWordsUrl);
        const text = await response.text();
        setTextEnglish(text);
        setData(text);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedData = useMemo(() => {
    if (data) {
      const lines = data.split('\n');
      return lines;
    }
    return [];
  }, [data]);

  // Async solver function that runs at the beginning of the game
  const computeSolverAsync = async (scrambledLetters: string[], wordsArray: string[]) => {
    console.log('🚀 Starting async solver computation...');
    setSolverComputing(true);
    
    // Start from a random position in the words file
    const randomStart = Math.floor(Math.random() * Math.max(0, wordsArray.length - 1000));
    console.log(`Starting search from random position: ${randomStart}`);
    
    return new Promise<string[]>((resolve) => {
      // Use setTimeout to make it non-blocking
      setTimeout(() => {
        const matchedWords: string[] = [];
        let processed = 0;
        
        // Process words in chunks to avoid blocking
        const processChunk = (startIndex: number) => {
          const chunkSize = 100;
          const endIndex = Math.min(startIndex + chunkSize, wordsArray.length);
          
          for (let i = startIndex; i < endIndex; i++) {
            const actualIndex = (randomStart + i) % wordsArray.length;
            const word = wordsArray[actualIndex];
            processed++;
            
            // First check if word has more than 4 letters
            if (word.length <= 4) {
              continue;
            }

            // Parse each letter in the word and verify if it exists in scrambledLetters
            let allLettersFound = true;
            for (let j = 0; j < word.length; j++) {
              const letter = word[j];
              if (!scrambledLetters.includes(letter)) {
                allLettersFound = false;
                break;
              }
            }
            
            if (allLettersFound && hasVowelAndConsonant(word)) {
              matchedWords.push(word);
              console.log(`✓ Pre-computed word found: "${word}"`);
              
              // Stop when we have enough words
              if (matchedWords.length >= 10) {
                break;
              }
            }
          }
          
          // Continue processing if we haven't found enough words and haven't processed all
          if (matchedWords.length < 10 && endIndex < wordsArray.length) {
            setTimeout(() => processChunk(endIndex), 0);
          } else {
            console.log(`✅ Async solver completed. Found ${matchedWords.length} words after processing ${processed} words`);
            setSolverComputing(false);
            resolve(matchedWords.slice(0, 10));
          }
        };
        
        processChunk(0);
      }, 0);
    });
  };

  // Effect to start pre-computing solver results when letters are available
  useEffect(() => {
    if (memoizedData.length > 0 && (consonants.length > 0 || voyels.length > 0) && !solverComputing) {
      const scrambledLetters = [...consonants, ...voyels];
      console.log('🎯 Starting pre-computation with letters:', scrambledLetters);
      
      computeSolverAsync(scrambledLetters, memoizedData).then((results) => {
        setPreComputedWords(results);
        console.log('💾 Pre-computed results stored:', results);
      });
    }
  }, [consonants, voyels, memoizedData, solverComputing]);

  // Utilitaire pour vérifier si un mot contient au moins une voyelle et une consonne
  function hasVowelAndConsonant(word: string) {
    const vowels = 'aeiouy';
    let hasVowel = false, hasConsonant = false;
    for (const c of word.toLowerCase()) {
      if (vowels.includes(c)) hasVowel = true;
      else if (c >= 'a' && c <= 'z') hasConsonant = true;
      if (hasVowel && hasConsonant) return true;
    }
    return false;
  }

  // Ajoute l'effet pour le solver à la fin du jeu
  useEffect(() => {
    console.log('Solver useEffect triggered, countdown:', countdown);
    console.log('Pre-computed words available:', preComputedWords.length);
    
    if (countdown === 0 && preComputedWords.length > 0) {
      console.log('🎯 Game ended - displaying pre-computed solver results');
      console.log('*** Pre-computed solver words:', preComputedWords);
      console.log('*** Setting showSolver to true');
      setSolverWords(preComputedWords);
      setShowSolver(true);
    } else if (countdown === 0 && preComputedWords.length === 0) {
      console.log('⚠️ Game ended but no pre-computed words available - solver still computing or failed');
      // Fallback: show computing message or empty results
      setSolverWords(['Computing...']);
      setShowSolver(true);
    } else {
      console.log('Solver conditions not met or resetting');
      setShowSolver(false);
    }
  }, [countdown, preComputedWords]);


  function MyComponent() {
    // useEffect(() => {
      let voy = printRandomVowels(6);
      let conson = printRandomConsonant(19);
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
    //   baseURL: "http://37.187.141.70",
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

  // useEffect(() => {
  //   // Receive Shadows
  //   beer.scene.traverse((child) => {
  //     if (
  //       child instanceof THREE.Mesh &&
  //       child.material instanceof THREE.MeshStandardMaterial
  //     ) {
  //       child.receiveShadow = true;
  //     }
  //   });
  // }, []);

  const clickToLetter = () => {
    if (document.pointerLockElement) {
      console.log('click')
    }
  };

  const removeLastLetter = () => {
    console.log("letter");
    console.log(cubeRigid[cubeRigid.length-1])
    let lastCube = cubeRigid[cubeRigid.length-1];
    // cubeRigid[cubeRigid.length-1])
    // cubeRigid[cubeRigid.length-1] = null;
    deleteItem(cubeRigid.length-1);
    const newArray = [
      ...wordSended.slice(0, wordSended.length-1),
      ...wordSended.slice(wordSended.length-1 + 1)
    ];
    setWordSended(newArray);
    setPositionX(positionX+1.3);
    // Joue le son remove.wav
    const audio = new window.Audio('/remove.wav');
    audio.volume = 0.7;
    audio.play();
  }

  const sendWord = (word) => {
    console.log("word")
    console.log(word)
    console.log(word.wordSended)
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

    if(completeWord[0].length < 2){
        const newMesh = (
        <mesh
            position={[positionX, 1, 0]}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="yellow" />
        </mesh>
        );
        audioLoader.load( 'youwin.wav', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        sound.play();
        });
        setCubeVerify(newMesh);
    }
    else{
        // const expensiveValue = useMemo(() => {
        //     console.log('Calculating expensive value...');
        //     fetch(allEnglishWords)
        //     .then(r => r.text())
        //     .then(text => {
        //         console.log('text decoded:', text);
        //         setTextEnglish(text);
        //         return text; // Supposons que ceci est un calcul coûteux
        //     })
        // }, []);

        // const newMesh = (
        // <mesh
        //     position={[positionX, 3, -6]}
        //     castShadow
        //     receiveShadow
        // >
        //     <boxGeometry args={[3, 1, 1]} />
        //     <meshStandardMaterial color="purple" />
        // </mesh>
        // );
        // audioLoader.load( 'youwin.wav', function( buffer ) {
        // sound.setBuffer( buffer );
        // sound.setLoop( false );
        // sound.setVolume( 0.5 );
        // sound.play();
        // });
        // setCubeVerify(newMesh);

        // fetch(allEnglishWords)
        // .then(r => r.text())
        // .then(text => {
        //     console.log('text decoded:', text);
        //     setTextEnglish(text);
            
        //     // word="house";

        //     // var arraycontainsturtles = (text.indexOf("eee") > -1);
        //     // console.log("FIND "+arraycontainsturtles);
        //     // var result = Object.keys(word).map((key) => [key, word[key]]);
        //     // console.log(result)
        //     // console.log(word.join(''))


        //     // .some(w => w.startsWith(word) && w === word)

        //     const lines = text.split('\n');
        //     console.log("lines")
        //     console.log(lines)
        //     // let linesSplit = line.split(' ');
        //     // console.log(linesSplit);
        //     // console.log("linesSplit");
            const matches = memoizedData.filter(line =>
            line.split(' ').some(w => w.toLowerCase().startsWith(completeWord[0]) && w.toLowerCase() === completeWord[0])
            );
            // const matches=["house"];
            console.log("matches");
            console.log(matches);
            console.log(matches.length);
            if(matches.length > 0){
                setSuccessWords(prev => [...prev, completeWord[0]]);
                setScore(prev => prev + calcWordScore(completeWord[0]));
                const newMesh = (
                    <mesh
                    position={[positionX, 1, 0]}
                    castShadow
                    receiveShadow
                    >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="green" />
                    </mesh>
                );
                audioLoader.load( 'youwin.wav', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( false );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
                setCubeVerify(newMesh);
                setTimeout(() => {
                    setCubeVerify(null);
                    setCubeRigid([]);
                    setCubeMesh([]);
                    setCubeText([]);
                    setWordSended([]);
                    setPositionX(5);
                }, 1000);
            }
            else{
                const newMesh = (
                    <mesh
                    position={[positionX, 1, 0]}
                    castShadow
                    receiveShadow
                    >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="red" />
                    1, 1, 1</mesh>
                );
                audioLoader.load( 'wrong.wav', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( false );
                    sound.setVolume( 0.5 );
                    sound.play();
                });
                setCubeVerify(newMesh);
                // Make verification cube disappear after 2 seconds
                setTimeout(() => {
                    setCubeVerify(null);
                }, 1000);
            // var arraycontainsturtles2 = text.includes(completeWord[0]);
            // console.log("FIND2 "+arraycontainsturtles2);
            }
    };
  }

  const sendLetter = (letter, positionX) => {
    console.log('click send 1 '+letter)
    setWordSended(wordSended => [...wordSended, letter])
    // console.log(wordSended)
    console.log(wordSended.length)

    const newMesh = (
      <mesh
        position={[positionX, 1, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    );
    const newText = (
      <Text
      rotation={[0, Math.PI, 0]}
      position={[positionX, 1, -0.51]}
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

    useEffect(() => {
      document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

    const handleRestart = () => {
      setScore(0);
      setSuccessWords([]);
      setCubeRigid([]);
      setCubeMesh([]);
      setCubeText([]);
      setWordSended([]);
      setPositionX(5);
      setShowSolver(false);
    };

    const handleCountdownChange = (newCountdown: number) => {
      setCountdown(newCountdown);
    };

    const testSolver = () => {
      console.log("🧪 Testing solver with current letters");
      console.log("Consonants:", consonants);
      console.log("Voyels:", voyels);
      console.log("Pre-computed words available:", preComputedWords.length);
      console.log("Solver computing:", solverComputing);
      
      if (preComputedWords.length > 0) {
        console.log("📋 Using pre-computed results for test:");
        console.log("Pre-computed words:", preComputedWords);
        setSolverWords(preComputedWords);
        setShowSolver(true);
      } else if (solverComputing) {
        console.log("⏳ Solver is still computing in background...");
        setSolverWords(['Computing...']);
        setShowSolver(true);
      } else {
        console.log("⚠️ No pre-computed results available and not computing - starting fresh computation");
        // Force trigger solver for testing if no pre-computed results
        if (consonants.length > 0 || voyels.length > 0) {
          const scrambledLetters = [...consonants, ...voyels];
          console.log("Available letters:", scrambledLetters);
          
          const wordsArray = memoizedData;
          console.log("First 20 words:", wordsArray.slice(0, 20)); // Log first 20 words
          console.log("Total words in dictionary:", wordsArray.length);

          /* This codeblock gets all the words that contains the letters */
          const matchedWords = wordsArray.filter((word) => {
            // First check if word has more than 4 letters
            if (word.length <= 4) {
              return false;
            }

            // Parse each letter in the word and verify if it exists in scrambledLetters
            for (let i = 0; i < word.length; i++) {
              const letter = word[i];
              console.log(`Checking if letter "${letter}" from word "${word}" is in scrambledLetters`);
              
              if (!scrambledLetters.includes(letter)) {
                console.log(`✗ Letter "${letter}" not found in scrambledLetters`);
                return false; // If any letter is not in scrambledLetters, word doesn't match
              }
            }
            
            console.log(`✓ Word "${word}" - all letters found in scrambledLetters`);
            return true; // All letters in word are in scrambledLetters
          });
          console.log("Matched words (contains letters):", matchedWords.length);

          /* This codeblock gets the exact word(s) that can be built with the letters */
          const validLengthWords = matchedWords.filter(
            (word) => word.length > 4 && word.length <= scrambledLetters.length
          );
          console.log("Valid length words (>4 chars):", validLengthWords.length);

          let possibleMatches: string[] = [];

          validLengthWords.forEach((dicWord) => {
            let foundLetters: string[] = [];
            let scrambledLettersCopy = scrambledLetters.slice();

            [...dicWord].forEach((dicWordLetter) => {
              for (let i = 0; i < scrambledLettersCopy.length; i++) {
                if (dicWordLetter === scrambledLettersCopy[i]) {
                  foundLetters.push(dicWordLetter);
                  scrambledLettersCopy.splice(i, 1);
                  break;
                }
              }
            });

            if (foundLetters.length === dicWord.length) {
              const foundWord = foundLetters.join('');
              
              if (hasVowelAndConsonant(foundWord) && foundWord === dicWord) {
                possibleMatches.push(foundWord);
              }
            }
          });

          const uniqueWords = [...new Set(possibleMatches)].slice(0, 10);
          console.log("Final solver words:", uniqueWords);
          setSolverWords(uniqueWords);
          setShowSolver(true);
        }
      }
    };

    return (
      <group position={[0, 0, 10]}>
        {/* <RigidBody type="fixed" colliders="trimesh" rotation={[0, Math.PI, 0]}>
          <primitive object={beer.scene} />
        </RigidBody> */}

        {cubeRigid.map((item, i, arr) => {
          // if (arr.length - 1 === i) {
            console.log(cubeMesh)
            return (
              <React.Fragment key={i}>
                {item}
              </React.Fragment>
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
        {cubeSuccess}
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
          // console.log(wordSended)
          return (
            <Text
              key={`consonant-${_idx}`}
              rotation={[0, Math.PI, 0]}
              position={[3+_idx, 4, 0]}
              color="red"
              fontSize={0.5}
              onClick={countdown === 0 ? undefined : (e) => sendLetter(voyel, positionX)}
              onPointerOver={countdown === 0 ? undefined : () => setHovered(true)}
              onPointerOut={countdown === 0 ? undefined : () => setHovered(false)}
            >
              {voyel}
            </Text>
          );
        })}
        {voyels.map((voyel, _idx) => {
          // console.log(voyel)
          // console.log(wordSended)
          return (
            <Text
              key={`vowel-${_idx}`}
              rotation={[0, Math.PI, 0]}
              position={[0-_idx, 4, 0]}
              color="red"
              fontSize={0.5}
              onClick={countdown === 0 ? undefined : (e) => sendLetter(voyel, positionX)}
              onPointerOver={countdown === 0 ? undefined : () => setHovered(true)}
              onPointerOut={countdown === 0 ? undefined : () => setHovered(false)}
            >
              {voyel}
            </Text>
          );
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

            <group position={[-3, 1, 0]} onClick={countdown === 0 ? undefined : (e) => sendWord({wordSended})}>
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
            <group position={[2, 4, 0]} onClick={(e) => removeLastLetter()}>
              <Text
                rotation={[0, Math.PI, 0]}
                position={[0, 1, 0]}
                color="black"
                fontSize={0.5}
              >
              Remove Letter
              </Text>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={"lightsteelblue"} />
              </mesh>
            </group>
            <group position={[2, 2, 0]} onClick={(e) => testSolver()}>
              <Text
                rotation={[0, Math.PI, 0]}
                position={[0, 1, 0]}
                color="black"
                fontSize={0.5}
              >
                Test Solver
              </Text>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={"orange"} />
              </mesh>
            </group>

      <CountDown onRestart={handleRestart} onTimeChange={handleCountdownChange} />
      <group position={[6, 6, 0]} rotation={[0, Math.PI, 0]}>
        {/* Billboard fond */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[8, 2]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Score */}
        <Text
          position={[-2.5, 0.4, 0]}
          fontSize={0.7}
          color="#1a237e"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Score : {score}
        </Text>
        {/* Countdown */}
        <Text
          position={[2.5, 0.4, 0]}
          fontSize={0.7}
          color="#b71c1c"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {countdown > 0 ? `⏳ ${Math.floor(countdown/60)}:${(countdown%60).toString().padStart(2,'0')}` : '⏳ 0:00'}
        </Text>
      </group>
      {successWords.map((word, idx) => {
        const wordsPerLine = 1;
        const line = Math.floor(idx / wordsPerLine);
        const col = idx % wordsPerLine;
        return (
          <group
            key={word+idx}
            position={[col * 2.2, 8.5 - line * 0.5, 4]}
            rotation={[0, Math.PI, 0]}
          >
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[3, 1]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Text
              position={[0, 0, 0]}
              fontSize={0.6}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {word}
            </Text>
          </group>
        );
      })}
      {/* Affiche le billboard solver à la fin du jeu */}
      {showSolver && (
        <group position={[0, 3, 0]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#fffde7" />
          </mesh>
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.7}
            color="#1a237e"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            Unscramble Solver
          </Text>
          {solverWords.map((w, i) => (
            <Text
              key={w + i}
              position={[-5 + (i % 2) * 5, 1.2 - Math.floor(i / 2) * 1.2, 0]}
              fontSize={0.6}
              color="#222"
              anchorX="center"
              anchorY="middle"
            >
              {w}
            </Text>
          ))}
        </group>
      )}
      </group>
);
  
}

// Ajoute la fonction utilitaire si absente
function calcWordScore(word: string) {
  const vowels = 'aeiouy';
  let s = 0;
  const isLong = word.length > 4;
  for (const c of word.toLowerCase()) {
    if (vowels.includes(c)) s += 3;
    else if (c >= 'a' && c <= 'z') s += isLong ? 4 : 2;
  }
  return s;
}
