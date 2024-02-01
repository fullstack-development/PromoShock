from dataclasses import dataclass


@dataclass(frozen=True)
class Ticket:
    ticket_id: str


@dataclass(frozen=True)
class Viewer:
    viewer_id: str

    def __eq__(self, other: object) -> bool:
        if (not isinstance(other, Viewer)):
            return False
        return self.viewer_id == other.viewer_id
