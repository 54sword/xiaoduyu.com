import { Editor, EditorState, RichUtils, Entity, AtomicBlockUtils, convertToRaw, convertFromRaw, CompositeDecorator } from 'draft-js'

function getEntityStrategy(mutability) {
  return function(contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return Entity.get(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE': return styles.immutable;
    case 'MUTABLE': return styles.mutable;
    case 'SEGMENTED': return styles.segmented;
    default: return null;
  }
}

const TokenSpan = (props) => {
  const style = getDecoratedStyle(
    Entity.get(props.entityKey).getMutability()
  )
  return (
    <span {...props} style={style}>
      {props.children}
    </span>
  )
}

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('IMMUTABLE'),
    component: TokenSpan,
  },
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: TokenSpan,
  },
  {
    strategy: getEntityStrategy('SEGMENTED'),
    component: TokenSpan,
  }
])


const JSONConvertToRaw = (json)=>{
  let e = EditorState.createWithContent(convertFromRaw(JSON.parse(json)), decorator)
  const content = e.getCurrentContent()
  return convertToRaw(content)
}

export default JSONConvertToRaw
