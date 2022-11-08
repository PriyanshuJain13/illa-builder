import { createContext, FC, ReactNode, useCallback } from "react"
import { PanelFieldConfig } from "@/page/App/components/InspectPanel/interface"
import { generateColumnItemId } from "../utils/generateNewColumns"
import { MenuList } from "@/widgetLibrary/MenuWidget/interface"

interface ProviderProps {
  columnItems: MenuList[]
  childrenSetter: PanelFieldConfig[]
  widgetDisplayName: string
  attrPath: string
  handleUpdateDsl: (attrPath: string, value: any) => void
  children: ReactNode
}

interface Inject extends Omit<ProviderProps, "children"> {
  handleDeleteMenuItem: (index: number) => void
  handleCopyColumnItem: (index: number) => void
  handleDeleteSubMenuItem: (index: number, subIndex: number) => void
  handleMoveColumnItem: (dragIndex: number, hoverIndex: number) => void
  handleUpdateItemVisible: (attrName: string, visible?: boolean) => void
}

export const ColumnListSetterContext = createContext<Inject>({} as Inject)

export const ColumnsSetterProvider: FC<ProviderProps> = (props) => {
  const { columnItems, attrPath, handleUpdateDsl } = props

  const handleDeleteMenuItem = useCallback(
    (index: number) => {
      const updatedArray = columnItems.filter(
        (optionItem: Record<string, any>, i: number) => {
          return i !== index
        },
      )
      handleUpdateDsl(attrPath, updatedArray)
    },
    [columnItems, handleUpdateDsl, attrPath],
  )

  const handleDeleteSubMenuItem = useCallback(
    (index: number, subIndex: number) => {
      const updatedArray = JSON.parse(JSON.stringify(columnItems))
      updatedArray[index].subMenu = updatedArray[index].subMenu?.filter(
        (optionItem: Record<string, any>, i: number) => {
          return i !== subIndex
        },
      )
      handleUpdateDsl(attrPath, updatedArray)
    },
    [columnItems, handleUpdateDsl, attrPath],
  )

  const handleCopyColumnItem = useCallback(
    (index: number) => {
      let targetOptionItem = columnItems.find(
        (optionItem: Record<string, any>, i: number) => {
          return i === index
        },
      )
      if (!targetOptionItem) return
      targetOptionItem = {
        ...targetOptionItem,
        id: generateColumnItemId(),
      }
      const updatedArray = [...columnItems, targetOptionItem]
      handleUpdateDsl(attrPath, updatedArray)
    },
    [columnItems, handleUpdateDsl, attrPath],
  )

  const handleMoveColumnItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragOptionItem = columnItems[dragIndex]
      const newOptions = [...columnItems]
      newOptions.splice(dragIndex, 1)
      newOptions.splice(hoverIndex, 0, dragOptionItem)
      handleUpdateDsl(attrPath, newOptions)
    },
    [attrPath, columnItems, handleUpdateDsl],
  )

  const handleUpdateItemVisible = useCallback(
    (attrName: string, visible?: boolean) => {
      handleUpdateDsl(attrName, visible)
    },
    [handleUpdateDsl],
  )

  const value = {
    ...props,
    handleDeleteMenuItem,
    handleCopyColumnItem,
    handleMoveColumnItem,
    handleUpdateItemVisible,
    handleDeleteSubMenuItem,
  }

  return (
    <ColumnListSetterContext.Provider value={value}>
      {props.children}
    </ColumnListSetterContext.Provider>
  )
}

ColumnsSetterProvider.displayName = "ColumnsSetterProvider"
