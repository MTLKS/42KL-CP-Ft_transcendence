import React from 'react'
import Card, { CardType } from '../../components/Card'
import CommandOption from './CommandOption'

interface HelpCardProps {
  title: string,
  usage: string,
  option: string,
  commandOptions: Array<Map<string, string>>;
}

function HelpCard(props: HelpCardProps) {

  const { title, usage, option, commandOptions } = props;

  return (
    <Card type={CardType.SUCCESS} key={Math.random().toString(36).slice(2) + Date.now().toString(36)}>
      <p className='text-xl font-bold uppercase'>{title}</p>
      <p className='text-sm text-highlight/60'>Usage: {usage}</p>
      <br />
      <p className='font-bold capitalize text-highlight text-md'>{option}:</p>
      {
        displayAllOptions()
      }
    </Card>
  )

  function getMaxLengthOfKey(allOptions: Array<Map<string, string>>): number {
    let max:number = 0;
    for (const option of allOptions) {
      for (const optionKey of option.keys()) {
        if (optionKey.length > max) max = optionKey.length;
      }
    }
    return max; 
  }

  function displayAllOptions() {
    const allOptions: JSX.Element[] = [];
    const maxKeyLength = getMaxLengthOfKey(commandOptions);
    let index: number = 0;
    for (const option of commandOptions) {
      allOptions.push(
        <CommandOption key={Math.random().toString(36).slice(2) + Date.now().toString(36)} options={option} spaces={maxKeyLength} />,
        <br key={"br"+index}/>
      )
      index++;
    }
    return allOptions;
  }
}

export default HelpCard